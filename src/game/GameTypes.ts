
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

export enum GameActionType{
  Deal = 1, 
  Play, 
  Discard,
  Clue
}

export type GameAction = {
  type: GameActionType,
  reveals?: CardReveal[]
}

export type GameEventSeries = GameAction[];

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

export enum CardDestination {
  Deck = 1,
  Hand,
  Stacks,
  Discard
}

export type HandUpdate = {
  turn: number, //The turn this update was made on / this should be unique in a hands history
  played?: number, //Card that was played to cause this hand state
  destination?: CardDestination // Where the card went
  replacement?: number, //Card that replaced slot 1 from deck
  result: number[] //Cards (by deck index) in hand after play
}

export type HandHistory = HandUpdate[]

export type CardKnowledgeUpdate = {
  turn: number, //The turn this update was made on / this should be unique in a cards history
  pips: PipStatus
}

export type CardKnowledgeHistory = CardKnowledgeUpdate[];

export type Stack = {
  suit: SuitData,
  cards: number[]
}


