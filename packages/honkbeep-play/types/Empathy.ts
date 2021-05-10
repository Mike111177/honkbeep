import { Rank, Suit } from "honkbeep-game";

export type Pips = {
  ranks: ReadonlyArray<Rank>;
  suits: ReadonlyArray<Suit>;
};
