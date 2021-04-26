import { Immutable } from "../../util/HelperTypes";
import { Rank } from "./Rank";
import { Suit } from "./Suit";

//Data required to describe a card
export type Card = Immutable<{
  rank: Rank;
  suit: Suit;
}>;

export default Card;
