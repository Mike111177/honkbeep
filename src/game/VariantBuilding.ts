import { ShufflerInput, VariantDefinition } from "./GameTypes";
import xorshift32 from "../util/xorshift32";

export function buildDeck({ suits }: VariantDefinition) {
  let deck = suits.map(suit => (
    [1, 1, 1, 2, 2, 3, 3, 4, 4, 5].map(rank => (
      { suit, rank }
    ))
  )).flat();
  return deck;
}

export function getShuffledOrder(length: number, seed: ShufflerInput = undefined) {
  let rng = new xorshift32(seed);
  let order = [...Array(length).keys()];
  for (let i = 0; i < length; i++) {
    let s = rng.next() % (length - 1);
    let tmp = order[s];
    order[s] = order[i];
    order[i] = tmp;
  }
  return {order, seed: rng.seed()};
}
