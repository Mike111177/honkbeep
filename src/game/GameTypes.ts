
export type CardData = {
  rank: number,
  suit: string
};

export type SuitData = string;

export type VariantDefinition = {
  suits: SuitData[],
  numPlayers: number,
  handSize: number
}

export type GameDefinition = {
  variant: VariantDefinition,
  playerNames: string[],
}

//May either be a seed or undefined
export type ShufflerInput = number | undefined;
//If you are given a GameDefinition and a ShufflerInput
//You should be able to derive the entire deck order
//Meant for spectators and post game review

export type CardReveal = {
  deck: number,
  card: number
}

export enum PlayResultType{
  Request = 1,
  Success,
  Misplay
}

type PlayRequestResult = {
  type: PlayResultType.Request;
}

type PlaySuccessResult = {
  type: PlayResultType.Success;
  stack: number;
}

type PlayMisplayResult=  {
  type: PlayResultType.Misplay;
}

export type PlayResult = PlaySuccessResult | PlayMisplayResult | PlayRequestResult;

export enum GameEventType{
  Deal = 1, 
  Play, 
  Discard,
  Clue
}

type GameDealEvent = {
  type: GameEventType.Deal;
  reveals?: CardReveal[]
}

type GamePlayEvent = {
  type: GameEventType.Play;
  player: number;
  handSlot: number;
  result: PlayResult;
  reveals?: CardReveal[];
}

type GameDiscardEvent = {
  type: GameEventType.Discard;
  reveals?: CardReveal[];
}

type GameClueEvent = {
  type: GameEventType.Clue;
  reveals?: CardReveal[];
}

export type GameEvent = 
  GameDealEvent |
  GamePlayEvent | 
  GameDiscardEvent |
  GameClueEvent;


export type GameEventSeries = GameEvent[];

//Minimum data to construct entire game state
export type GameState = {
  events: GameEventSeries,
  definition: GameDefinition
}

export enum PipStatus {
  Possible = 1,
  Impossible,
  KnownImpossible
}

export type HandUpdate = {
  turn: number, //The turn this update was made on / this should be unique in a hands history
  played?: number, //Card that was played to cause this hand state
  replacement?: number, //Card that replaced slot 1 from deck
  result: number[] //Cards (by deck index) in hand after play
}

export type HandHistory = HandUpdate[]

export type CardKnowledgeUpdate = {
  turn: number, //The turn this update was made on / this should be unique in a cards history
  pips: PipStatus
}

export type CardKnowledgeHistory = CardKnowledgeUpdate[];

export type Stack = number[];


