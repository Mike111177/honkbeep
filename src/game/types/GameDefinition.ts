import { Immutable } from "../../util/HelperTypes";
import Variant from "./Variant";

//Minimum Data to start game
export type GameDefinition = Immutable<{
  variant: Variant;
  playerNames: string[];
}>;
