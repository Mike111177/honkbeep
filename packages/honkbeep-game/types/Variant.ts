import { Immutable } from "honkbeep-util/HelperTypes";
import { Deck } from "..";
import { Suit } from "./Suit";

//Minimum data to build decks and get initial state
export type VariantDefinition = Immutable<{
  suits: Suit[];
  numPlayers: number;
  handSize: number;
}>;

export type Variant = Immutable<
  VariantDefinition & {
    deck: Deck;
  }
>;

export function buildVariant(def: VariantDefinition): Variant {
  return { ...def, deck: new Deck(def) };
}

export default Variant;
