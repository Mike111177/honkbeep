import ArrayUtil from "../util/ArrayUtil";
import { CardData, ShufflerInput, VariantDefinition } from "./GameTypes";
import xorshift32 from "./xorshift32";

const DEFAULT_SUIT_RANKS: ReadonlyArray<number> = [1, 2, 3, 4, 5];
const DEFAULT_SUIT_RANK_DIVISION: ReadonlyArray<number> = [3, 2, 2, 2, 1];

export class Deck {
  readonly cards: {
    data: CardData;
    count: number;
  }[];
  readonly lookup: number[];

  constructor(varient?: VariantDefinition) {
    if (varient === undefined) {
      this.cards = [];
      this.lookup = [];
    } else {
      const suits = varient.suits;
      this.cards = suits.map(suit => (
        DEFAULT_SUIT_RANKS.map((rank, i) => (
          {
            data: { suit, rank },
            count: DEFAULT_SUIT_RANK_DIVISION[i]
          }
        ))
      )).flat();
      this.lookup = this.cards.reduce<number[]>((acc, val, i) => acc.concat(ArrayUtil.fill(val.count, i)), []);
    }
  }

  getCard(index: number) {
    return this.cards[this.lookup[index]].data;
  }

  get length() {
    return this.lookup.length;
  }
}


function areCardsSame(a: CardData, b: CardData) {
  return a.rank === b.rank && a.suit === b.suit;
}

export function createProcuredOrder(deck: Deck, inputOrder: (number | CardData)[], seed?: ShufflerInput) {
  let order = ArrayUtil.iota(deck.length);
  let countProcured = 0;
  for (countProcured; countProcured < inputOrder.length; countProcured++) {
    let nextItem = inputOrder[countProcured];
    //If next item is a number, convert it to the right card data from deck
    if (typeof nextItem === "number") {
      nextItem = deck.getCard(nextItem);
      if (nextItem === undefined) {
        throw new Error("Invlaid Deck Item");
      }
    }
    //Find the first unused instance of this card in the deck
    let foundCard: boolean = false;
    for (let i = countProcured; i < order.length; i++) {
      if (areCardsSame(nextItem, deck.getCard(order[i]))) {
        //Once found swap with current position
        let tmp = order[countProcured];
        order[countProcured] = order[i];
        order[i] = tmp;
        foundCard = true;
        break;
      }
    }
    if (!foundCard) {
      throw new Error("Card Type Depleted");
    }
  }
  //Fill rest of deck with random order, who cares
  let remaining = order.slice(countProcured);
  let { order: rOrder, seed: rSeed } = getShuffledOrder(remaining.length, seed);
  for (let i = 0; i < remaining.length; i++) {
    order[i + countProcured] = remaining[rOrder[i]];
  }

  return { order, seed: rSeed };
}

export function getShuffledOrder(length: number, seed: ShufflerInput = undefined): { order: number[]; seed: number } {
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
