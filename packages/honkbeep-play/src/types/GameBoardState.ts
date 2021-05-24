import { Immutable } from "honkbeep-util";
import { GameEvent, Variant } from "honkbeep-game";

export interface GameBoardState {
  readonly variant: Immutable<Variant>;
  readonly playerNames: ReadonlyArray<string>;

  readonly events: GameEvent[];
}
