import { Immutable } from "../util/HelperTypes";
import GameEvent from "./types/GameEvent";
import Variant from "./types/Variant";

//Data required to describe a card
export type CardData = Immutable<{
  rank: number;
  suit: string;
}>;

//Data required to describe suit
export type SuitData = string;

//Minimum Data to start game
export type GameDefinition = Immutable<{
  variant: Variant;
  playerNames: string[];
}>;

//May either be a seed or undefined
export type ShufflerInput = number | undefined;
//If you are given a GameDefinition and a ShufflerInput
//You should be able to derive the entire deck order
//Meant for spectators and post game review

export type CardReveal = {
  deck: number;
  card: number;
};

export type GameEventSeries = GameEvent[];

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
