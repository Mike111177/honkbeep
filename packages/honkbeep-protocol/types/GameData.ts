import { GameEvent, VariantDefinition } from "honkbeep-game";

export type CardReveal = {
  deck: number;
  card: number;
};

//Game event data tailored for client consumption
export type GameEventMessage = {
  event: GameEvent;
  reveals?: CardReveal[];
};

//Minimum data to construct entire game state
export type GameData = {
  readonly events: GameEventMessage[];
  readonly playerNames: ReadonlyArray<string>;
  readonly variant: VariantDefinition;
};
