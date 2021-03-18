export enum EmpathyStatus {
  NotedFor = 0,    //Player gave it an elim note
  Possible,        //No notion
  NotedAgainst,    //Player made a note against it
  NotPossible,     //Player knows not possible
  KnownNotPossible //All players know this isn't possible
}
//Array of possible deck items or index of card
export type CardEmpathy = EmpathyStatus[] | number;
export type DeckEmpathy = CardEmpathy[];
export type Pips = {
  ranks: number[];
  suits: string[];
}

