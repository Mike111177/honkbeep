import { Immutable } from "honkbeep-util";
import { Clue } from "./Clue";

export const enum GameEventType {
  Deal = 1,
  Play,
  Discard,
  Clue,
  GameOver,
}

//Data that must be present in every game event to be valid
export type GameEventCommon = Immutable<{ turn: number }>;

//Game deal event
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

type GamePlayResultSuccess = Immutable<{
  result: GamePlayResultType.Success;
  stack: number;
}>;
type GamePlayResultMisplay = Immutable<{
  result: GamePlayResultType.Misplay;
}>;

export type GamePlayResult = Immutable<
  GamePlayResultSuccess | GamePlayResultMisplay
>;
export type GamePlayEvent = Immutable<GamePlayAttempt & GamePlayResult>;

//Game discard event
export type GameDiscardAttempt = Immutable<{
  type: GameEventType.Discard;
  card: number;
}>;
export type GameDiscardEvent = Immutable<GameDiscardAttempt & GameEventCommon>;

//Game Clue event
export type GameClueAttempt = Immutable<{
  type: GameEventType.Clue;
  target: number;
  clue: Clue;
}>;
export type GameClueResult = Immutable<{ touched: number[] }>;
export type GameClueEvent = Immutable<GameClueAttempt & GameClueResult>;

//Game over event
export const enum GameOverCondition {
  LastTurn = 1,
  Win,
  Strikeout,
  Timeout,
  Terminate,
}

type GameOverLastTurn = {
  type: GameEventType.GameOver;
  condition: GameOverCondition.LastTurn;
};

type GameOverWin = {
  type: GameEventType.GameOver;
  condition: GameOverCondition.Win;
};

type GameOverStrikeout = {
  type: GameEventType.GameOver;
  condition: GameOverCondition.Strikeout;
};

export type GameOverEvent = Immutable<
  GameOverLastTurn | GameOverWin | GameOverStrikeout
>;

//Represents any action taken by a player that could advance to the next turn (or deal, or game over)
export type GameEvent = Immutable<
  GameEventCommon &
    (
      | GameDealEvent
      | GamePlayEvent
      | GameDiscardEvent
      | GameClueEvent
      | GameOverEvent
    )
>;

//Data representing players attempt cause an event
export type GameAttempt = Immutable<
  GamePlayAttempt | GameDiscardAttempt | GameClueAttempt
>;

export default GameEvent;
