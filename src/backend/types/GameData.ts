import { GameDefinition, GameEvent } from "../../game";

export type CardReveal = {
  deck: number;
  card: number;
};

//Minimum data to construct entire game state
export type GameData = {
  events: GameEventMessage[];
  definition: GameDefinition;
};

//Game event data tailored for client consumption
export type GameEventMessage = {
  event: GameEvent;
  reveals?: CardReveal[];
};
