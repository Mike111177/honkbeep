import { Immutable } from "honkbeep-util/HelperTypes";
import { Rank } from "./Rank";
import { Suit } from "./Suit";

//Data required to describe a card
export type CardFace = Immutable<{
  rank: Rank;
  suit: Suit;
}>;

export default CardFace;
