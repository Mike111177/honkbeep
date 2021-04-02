import { createProcuredOrder } from "./DeckBuilding";
import { GameDefinition } from "./GameTypes";
import {
  initGameStateFromDefinition,
  reduceGameEvent,
} from "./states/GameState";
import { GameEventType } from "./types/GameEvent";
import { buildVariant, VariantDefinition } from "./types/Variant";

export function genericPlayers<T extends VariantDefinition>({ numPlayers }: T) {
  return [
    "Alice",
    "Bob",
    "Cathy",
    "Donald",
    "Emily",
    "Frederick",
    "George",
    "Harley",
  ].splice(0, numPlayers);
}

export function genericVariant(): VariantDefinition {
  return {
    suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
    numPlayers: 4,
    handSize: 4,
  };
}

export function genericDefinition(): GameDefinition {
  const variant = buildVariant(genericVariant());
  return {
    variant,
    playerNames: genericPlayers(variant),
  };
}

export function genericSampleGame() {
  const definition = genericDefinition();
  const { variant } = definition;
  const deckOrderDef = createProcuredOrder(variant.deck, [
    //Player 1
    { rank: 1, suit: "Red" },
    { rank: 1, suit: "Red" },
    { rank: 1, suit: "Red" },
    { rank: 2, suit: "Red" },
    //Player 2
    { rank: 3, suit: "Green" },
    { rank: 4, suit: "Purple" },
    { rank: 5, suit: "Red" },
    { rank: 1, suit: "Blue" },
    //Player 3
    { rank: 1, suit: "Green" },
    { rank: 4, suit: "Blue" },
    { rank: 1, suit: "Yellow" },
    { rank: 2, suit: "Green" },
    //Player 4
    { rank: 3, suit: "Purple" },
    { rank: 2, suit: "Yellow" },
    { rank: 2, suit: "Green" },
    { rank: 4, suit: "Yellow" },
  ]);
  const state0 = initGameStateFromDefinition(variant);
  const state1 = reduceGameEvent(
    state0,
    { turn: 0, type: GameEventType.Deal },
    variant
  );
  return {
    variant,
    deck: variant.deck,
    deckOrderDef,
    order: deckOrderDef.order,
    state0,
    state1,
    definition,
  };
}
