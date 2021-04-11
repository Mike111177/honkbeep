import * as ArrayUtil from "../util/ArrayUtil";
import { xorshift32 } from "../util/rng";
import { Card, Deck } from ".";

export function createProcuredDeckOrder(
  deck: Deck,
  inputOrder: (number | Card)[],
  seed?: ShufflerInput
) {
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
  //Fill rest of deck with random order
  let remaining = order.slice(countProcured);
  let { order: rOrder, seed: rSeed } = getShuffledOrder(remaining.length, seed);
  for (let i = 0; i < remaining.length; i++) {
    order[i + countProcured] = remaining[rOrder[i]];
  }

  return { order, seed: rSeed };
}

export function areCardsSame(a: Card, b: Card) {
  return a.rank === b.rank && a.suit === b.suit;
}

export type ShufflerInput = number | undefined;
export function getShuffledOrder(
  length: number,
  seed: ShufflerInput = undefined
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
