import { Immutable } from "honkbeep-util";
import { Clue } from "./Clue";

export const enum GameEventType {
  Deal = 1,
  Play,
  Discard,
  Clue,
}

//Data that must be present in every game event to be valid
export type GameEventCommon = Immutable<{ turn: number }>;

//GameDeal
export type GameDealEvent = {
  type: GameEventType.Deal;
} & GameEventCommon;

//Players Attempt to play card
export type GamePlayAttempt = Immutable<{
  type: GameEventType.Play;
  card: number;
}>;
export const enum GamePlayResultType {
  Success = 1,
  Misplay,
}
export type GamePlayResultSuccess = Immutable<{
  result: GamePlayResultType.Success;
  stack: number;
}>;
export type GamePlayResultMisplay = Immutable<{
  result: GamePlayResultType.Misplay;
}>;
export type GamePlayResult = Immutable<
  GamePlayResultSuccess | GamePlayResultMisplay
>;
export type GamePlayEvent = Immutable<GamePlayAttempt & GamePlayResult>;

//GameDiscard
export type GameDiscardAttempt = Immutable<{
  type: GameEventType.Discard;
  card: number;
}>;
export type GameDiscardEvent = Immutable<GameDiscardAttempt & GameEventCommon>;

export type GameClueAttempt = Immutable<{
  type: GameEventType.Clue;
  target: number;
  clue: Clue;
}>;
export type GameClueResult = Immutable<{ touched: number[] }>;
export type GameClueEvent = Immutable<GameClueAttempt & GameClueResult>;

//Represents any action taken by a player that could advance to the next turn (or deal)
export type GameEvent = Immutable<
  GameEventCommon &
    (GameDealEvent | GamePlayEvent | GameDiscardEvent | GameClueEvent)
>;

//Data representing players attempt cause an event
export type GameAttempt = Immutable<
  GamePlayAttempt | GameDiscardAttempt | GameClueAttempt
>;

export default GameEvent;
