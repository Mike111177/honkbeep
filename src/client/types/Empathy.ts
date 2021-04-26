import { Rank, Suit } from "../../game";

export type Pips = {
  ranks: ReadonlyArray<Rank>;
  suits: ReadonlyArray<Suit>;
};
