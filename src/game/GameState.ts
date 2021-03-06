import { produce } from "immer";

import {
  CardData,
  GameEventType,
  GamePlayEvent,
  GameDiscardEvent,
  GameData,
  GamePlayResultType,
  GameDefinition,
  GameEventMessage,
  VariantDefinition,
} from "./GameTypes";
import { buildDeck } from "./VariantBuilding";

export enum PipStatus {
  Possible = 1,
  Impossible,
  KnownImpossible
}

export type HandUpdate = {
  turn: number; //The turn this update was made on / this should be unique in a hands history
  played?: number; //Card that was played to cause this hand state
  replacement?: number; //Card that replaced slot 1 from deck
  result: number[]; //Cards (by deck index) in hand after play
}

export type HandHistory = HandUpdate[]

export type CardKnowledgeUpdate = {
  turn: number; //The turn this update was made on / this should be unique in a cards history
  pips: PipStatus;
}

export type Stack = number[];

export type GameState = {
  readonly cards: CardData[];
  turn: number;
  knownDeckOrder: number[];
  hands: number[][];
  stacks: Stack[];
  discardPile: number[];
  topDeck: number;
}

function reduceDealEvent(state: GameState, definition: GameDefinition) {
  //Turn 0, Deal
  state.hands = [];
  for (let p = 0; p < definition.variant.numPlayers; p++) {
    state.hands[p] = [];
    for (let s = 0; s < definition.variant.handSize; s++) {
      state.hands[p].push(state.topDeck);
      state.topDeck++;
    }
  }
  //Advance to next players turn
  state.turn++;
}

function reducePlayEvent(state: GameState, player: number, event: GamePlayEvent) {
  //Create copy of current hand to make new hand
  let newHand = Array.from(state.hands[player]);
  //Remove played card from hand
  let card = newHand.splice(event.handSlot, 1)[0];
  if (event.result === GamePlayResultType.Success) {
    //If it was a successful play, add card to proper stack
    state.stacks[event.stack].push(card);
  } else if (event.result === GamePlayResultType.Misplay) {
    //if it was a missplay put it in the discard pile 
    state.discardPile.push(card);
  }
  //Put card on top of deck in leftmost slot
  newHand.unshift(state.topDeck);
  //Update the players hand
  state.hands[player] = newHand;
  //Mark off another from the deck
  state.topDeck++;
  //Advance to next players turn
  state.turn++;
}

function reduceDiscardEvent(state: GameState, player: number, event: GameDiscardEvent) {
  //Create copy of current hand to make new hand
  let newHand = Array.from(state.hands[player]);
  //Remove  discarded card from hand
  let card = newHand.splice(event.handSlot, 1)[0];
  //Put it in the discard pile
  state.discardPile.push(card);
  //Put card on top of deck in leftmost slot
  newHand.unshift(state.topDeck);
  //Update the players hand
  state.hands[player] = newHand;
  //Mark off another from the deck
  state.topDeck++;
  //Advance to next players turn
  state.turn++;
}

function reduceEventMessage(state: GameState, data: GameData, message: GameEventMessage) {
  //Process Actions
  const { event, reveals } = message;
  let player = (event.turn - 1) % data.definition.variant.numPlayers;
  switch (event.type) {
    case GameEventType.Deal:
      reduceDealEvent(state, data.definition);
      break;
    case GameEventType.Play:
      reducePlayEvent(state, player, event);
      break;
    case GameEventType.Discard:
      reduceDiscardEvent(state, player, event);
      break;
  }
  //Process Reveals
  if (reveals) {
    for (let revealedCard of reveals) {
      state.knownDeckOrder[revealedCard.deck] = revealedCard.card;
    }
  }
}

export function initBlankGameState(): GameState {
  return {
    cards: [],
    turn: -1,
    knownDeckOrder: [],
    hands: [],
    stacks: [],
    discardPile: [],
    topDeck: 0,
  };
}

export function initGameStateFromVarient(variant: VariantDefinition): GameState {
  return {
    cards: buildDeck(variant),
    turn: 0,
    knownDeckOrder: [],
    hands: [],
    stacks: variant.suits.map<number[]>(_ => ([])),
    discardPile: [],
    topDeck: 0,
  };
}

export function reduceGameStateFromGameData(state: GameState, data: GameData, max_turn: number = data.events.length) {
  let messages = data.events;
  if (state.turn === -1) {
    state = initGameStateFromVarient(data.definition.variant);
  }
  state = produce(state, s => {
    for (let i = s.turn; i < Math.min(messages.length, max_turn + 1); i++) {
      reduceEventMessage(s, data, messages[i]);
    }
  });
  return state;
}

