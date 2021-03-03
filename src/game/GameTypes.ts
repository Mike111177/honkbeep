//Data required to describe a card
export type CardData = {
  rank: number;
  suit: string;
};

//Data required to describe suit
export type SuitData = string;

//Minimum data to build decks and get initial state
export type VariantDefinition = {
  suits: SuitData[];
  numPlayers: number;
  handSize: number;
}

//Minimum Data to start game
export type GameDefinition = {
  variant: VariantDefinition;
  playerNames: string[];
}

//May either be a seed or undefined
export type ShufflerInput = number | undefined;
//If you are given a GameDefinition and a ShufflerInput
//You should be able to derive the entire deck order
//Meant for spectators and post game review

export type CardReveal = {
  deck: number;
  card: number;
}

export enum GameEventType {
  Deal = 1,
  Play,
  Discard,
  Clue
}

//GameDeal
export type GameDealEvent = {
  type: GameEventType.Deal;
}

//GamePlay
export type GamePlayAttempt = {
  type: GameEventType.Play;
  handSlot: number;
};
export enum GamePlayResultType { Success = 1, Misplay }
export type GamePlayResultSuccess = { result: GamePlayResultType.Success; stack: number } 
export type GamePlayResultMisplay = { result: GamePlayResultType.Misplay }
export type GamePlayResult = GamePlayResultSuccess | GamePlayResultMisplay;
export type GamePlayEvent = GamePlayAttempt & GamePlayResult;

//GameDiscard
export type GameDiscardAttempt = {
  type: GameEventType.Discard;
  handSlot: number;
};
export type GameDiscardEvent = GameDiscardAttempt;

//Clue description
export enum ClueType{
  Number = 1,
  Color
}
type NumberClue = {
  type: ClueType.Number;
  number: number;
}
type ColorClue = {
  type: ClueType.Color;
  color: string;
}
export type Clue = NumberClue | ColorClue;

export type GameClueAttempt = {
  type: GameEventType.Clue;
  target: number;
  clue: Clue;
}
export type GameClueResult = {touched: number[];}
export type GameClueEvent = GameClueAttempt & GameClueResult;

//Represents any action taken by a player that could advance to the next turn (or deal)
export type GameEvent = {
  turn: number;
} &
  (GameDealEvent |
    GamePlayEvent |
    GameDiscardEvent |
    GameClueEvent);

//Data representing players attempt cause an event
export type GameAttempt = GamePlayAttempt | GameDiscardAttempt | GameClueAttempt;

export type GameEventSeries = GameEvent[];

//Minimum data to construct entire game state
export type GameState = {
  events: GameEventMessage[];
  definition: GameDefinition;
}

//Game event data tailored for client consumption
export type GameEventMessage = {
  event: GameEvent;
  reveals?: CardReveal[];
}


