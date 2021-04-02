import { Immutable } from "../../util/HelperTypes";
import { Deck } from "../DeckBuilding";
import { SuitData } from "../GameTypes";

//Minimum data to build decks and get initial state
export type VariantDefinition = Immutable<{
  suits: SuitData[];
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
