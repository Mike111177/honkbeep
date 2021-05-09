import { GameState, Clue } from "../../game";
import { Pips } from "../types/Empathy";
import { Location } from "../types/Location";

//Additional Per-Turn Metadata that the client attaches to the game sate
export type TurnState = {
  //Metadata for each card
  readonly cardMeta: ReadonlyArray<{
    //Tracking the location of this card
    readonly location: Location;
    //Was this card touched yes or no
    readonly touched: boolean;
    //Turns where clues that affected this card
    readonly clues: ReadonlyArray<{ turn: number; pos: boolean; clue: Clue }>;
    //Empathy
    readonly cluedPossibleCards: ReadonlyArray<number>;
    readonly cluedPips: Pips;
    readonly deducedPossibleCards: ReadonlyArray<number>;
    readonly deducedPips: Pips;
  }>;
} & GameState;
