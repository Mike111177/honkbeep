import { Immutable } from "../../util/HelperTypes";
import { Suit } from "./Suit";

//Data required to describe a card
export type Card = Immutable<{
  rank: number;
  suit: Suit;
}>;

export default Card;
