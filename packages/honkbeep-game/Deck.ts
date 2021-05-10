import { CardFace, VariantDefinition } from ".";
import * as ArrayUtil from "honkbeep-util/ArrayUtil";
import { xorshift32 } from "honkbeep-util/rng";

const DEFAULT_SUIT_RANKS: ReadonlyArray<number> = [1, 2, 3, 4, 5];
const DEFAULT_SUIT_RANK_DIVISION: ReadonlyArray<number> = [3, 2, 2, 2, 1];

/**
 * Immutable data structure to carry information about cards in a deck for a given variant
 */
export class Deck {
  //Ordered Set of unique cards
  readonly faces: ReadonlyArray<Readonly<CardFace>>;
  //Map of cards for quick lookup as well as the count of each card
  readonly countMap: ReadonlyMap<Readonly<CardFace>, number>;
  //Map of deck index to card
  readonly cardFaces: ReadonlyArray<Readonly<CardFace>>;
  //Map to use when finding the location of a face not sourced from deck
  readonly nonLocalFaceMap: ReadonlyMap<
    CardFace["suit"],
    ReadonlyArray<Readonly<CardFace>>
  >;

  constructor(variant: VariantDefinition) {
    const suits = variant.suits;

    //Get the cards by each suit
    const cardsBySuit = suits.map((suit) => {
      const suitCards = DEFAULT_SUIT_RANKS.map((rank) => {
        const newCard = { suit, rank };
        Object.freeze(newCard);
        return newCard;
      });
      Object.freeze(suitCards);
      return suitCards;
    });

    //The lookup index is just a flat list of all the cards
    this.faces = cardsBySuit.flat();
    Object.freeze(this.faces);

    //The count map just figures out how many of each card should exist
    this.countMap = this.faces.reduce(
      (map, card) => map.set(card, DEFAULT_SUIT_RANK_DIVISION[card.rank - 1]),
      new Map<Readonly<CardFace>, number>()
    );
    Object.freeze(this.countMap);

    //For the lookup, each duplicate card needs to be accounted for from the countmap
    this.cardFaces = this.faces.reduce<Readonly<CardFace>[]>(
      (acc, card) => acc.concat(ArrayUtil.fill(this.countMap.get(card)!, card)),
      []
    );
    Object.freeze(this.cardFaces);

    this.nonLocalFaceMap = cardsBySuit.reduce(
      (map, suitCards, i) => map.set(suits[i], suitCards),
      new Map()
    );
    Object.freeze(this.nonLocalFaceMap);

    //The deck depends on it being immutable to function
    Object.freeze(this);
  }

  /**
   * Find card from deck that matches rank and suit of given card
   * @param card
   * @returns
   */
  getFaceByCardDescription({ suit, rank }: Readonly<CardFace>) {
    const card = this.nonLocalFaceMap.get(suit)?.[rank - 1];
    if (process.env.NODE_ENV !== "production" && card === undefined) {
      throw new Error(`Unknown card Suit: ${suit}, Rank: ${rank}!`);
    }
    return card!;
  }

  /**
   * Find card from deck by index
   * @param index
   * @returns
   */
  getFaceByCardIndex(index: number) {
    if (process.env.NODE_ENV !== "production" && index >= this.length) {
      throw new Error(`Card index out of bounds!`);
    }
    return this.cardFaces[index];
  }

  /**
   * Given a face to match or a deck index, find a corresponding face from the deck
   * Try to avoid usage of this in performance sensitive code, prefer to use
   * `getCardByDescription` or `getCardByIndex`
   * @param indexOrRef
   * @returns
   */
  getFaceByCard(indexOrRef: number | Readonly<CardFace>) {
    if (typeof indexOrRef === "number") {
      return this.getFaceByCardIndex(indexOrRef);
    } else {
      return this.getFaceByCardDescription(indexOrRef);
    }
  }

  /**
   * Given a card or a description of a card, return the amount of instances of that
   * card are contained in the deck
   * @param card
   * @returns
   */
  getCardCount(card: Readonly<CardFace>) {
    let count = this.countMap.get(card);
    if (count === undefined) {
      const localCard = this.getFaceByCardDescription(card);
      count =
        localCard !== undefined ? this.countMap.get(localCard) : undefined;
    }
    return count;
  }

  /**
   * Get indices of deck that are equivalent to given card description
   * This is not intended to be efficient...
   * @param card
   */
  getCardInstances({ rank, suit }: Readonly<CardFace>) {
    const card = this.getFaceByCard({ rank, suit });
    return ArrayUtil.iota(this.length).filter(
      (i) => this.getFaceByCard(i) === card
    );
  }

  get length() {
    return this.cardFaces.length;
  }
}

export function createProcuredDeckOrder(
  deck: Deck,
  inputOrder: (number | Readonly<CardFace> | undefined)[],
  seed?: number
) {
  //First check to make sure the input order is not longer than the deck
  if (inputOrder.length > deck.length) {
    throw new Error("Number of cards requested greater than length of deck!");
  }

  //Create array to fill requested cards
  const requestedOrder: (number | undefined)[] = [];
  //Also keep track of how many of each card we put in
  const inserted = new Map<Readonly<CardFace>, number>();

  for (const inputCard of inputOrder) {
    //Skip if user left this item undefined
    if (inputCard === undefined) {
      requestedOrder.push(undefined);
      continue;
    }

    //Get the card and the indices of this card, and the amount we have already inserted
    const cardFromDeck = deck.getFaceByCard(inputCard);
    const cardInstances = deck.getCardInstances(cardFromDeck);
    const amountAlreadyInserted = inserted.get(cardFromDeck) ?? 0;

    //If we don't have any more of this card, throw error
    if (amountAlreadyInserted >= cardInstances.length) {
      throw new Error("Card Type Depleted");
    }

    //Insert next available instance of this card
    requestedOrder.push(cardInstances[amountAlreadyInserted]);
    //Mark another inserted
    inserted.set(cardFromDeck, amountAlreadyInserted + 1);
  }

  //Create shuffle order as if were were just going to do it randomly
  const { order } = getShuffledOrder(deck.length, seed);
  //Remove cards from order that are already in the order
  const fillInOrder = order.filter((i) => requestedOrder.indexOf(i) === -1);

  //Expand requested order to length of deck
  requestedOrder.length = deck.length;
  //Fill empty slots of requestedOrder with cards from fillInOrder
  let fillIndex = 0;
  for (
    let requestIndex = 0;
    requestIndex < requestedOrder.length;
    requestIndex++
  ) {
    if (requestedOrder[requestIndex] === undefined) {
      requestedOrder[requestIndex] = fillInOrder[fillIndex];
      fillIndex++;
    }
  }

  //Assert validity
  if (process.env.NODE_ENV !== "production") {
    if (requestedOrder.indexOf(undefined) !== -1) {
      throw new Error("Procured output contains undefined");
    }
  }

  return { order: requestedOrder as number[] };
}

export function areCardsSame(a: CardFace, b: CardFace) {
  return a.rank === b.rank && a.suit === b.suit;
}

export function getShuffledOrder(
  length: number,
  seed?: number
): { order: number[]; seed: number } {
  let rng = new xorshift32(seed);
  let order = ArrayUtil.iota(length);
  for (let i = 0; i < length; i++) {
    let s = rng.next() % (length - 1);
    let tmp = order[s];
    order[s] = order[i];
    order[i] = tmp;
  }
  return { order, seed: rng.getSeed() };
}
