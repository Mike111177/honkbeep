import { Card, VariantDefinition } from "..";
import ArrayUtil from "../../util/ArrayUtil";

const DEFAULT_SUIT_RANKS: ReadonlyArray<number> = [1, 2, 3, 4, 5];
const DEFAULT_SUIT_RANK_DIVISION: ReadonlyArray<number> = [3, 2, 2, 2, 1];

export class Deck {
  readonly cards: ReadonlyArray<{
    readonly data: Readonly<Card>;
    readonly count: number;
  }>;
  readonly lookup: ReadonlyArray<number>;

  constructor(variant: VariantDefinition) {
    const suits = variant.suits;
    this.cards = suits
      .map((suit) =>
        DEFAULT_SUIT_RANKS.map((rank, i) => ({
          data: { suit, rank },
          count: DEFAULT_SUIT_RANK_DIVISION[i],
        }))
      )
      .flat();
    this.lookup = this.cards.reduce<number[]>(
      (acc, val, i) => acc.concat(ArrayUtil.fill(val.count, i)),
      []
    );
  }

  getCard(index: number) {
    return this.cards[this.lookup[index]].data;
  }

  get length() {
    return this.lookup.length;
  }
}
export default Deck;
