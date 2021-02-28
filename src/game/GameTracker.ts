import {
  CardData,
  ShufflerInput,
  GameEventType,
  GamePlayEvent,
  GameDiscardEvent,
  GameState,
  GamePlayResultType,
  GameDefinition,
} from "./GameTypes";
import { buildDeck, getShuffledOrder } from "./VariantBuilding";

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

export type CardKnowledgeHistory = CardKnowledgeUpdate[];

export type Stack = number[];

// Calculates current board state as new turns are played
export default class GameTracker {
  turnsProcessed: number = 0;
  topDeck: number = 0;

  //Array the size of the whole deck, 
  //each player not know the value of each card, but they 
  //do know where every card is, so this should provide a 
  //stable memoizable lookup table
  cardKnowledge: CardKnowledgeHistory[] = [];
  handHistories: HandHistory[] = [];

  //Unshuffled deck information
  cards: CardData[] = [];

  knownDeckOrder: number[] = [];

  stacks: Stack[] = [];
  discardPile: {turn:number; index:number}[] = []

  //Shuffled order of deck for spectator and review mode, and displaying discovered cards
  //Ergo shuffledOrder[0] contains the card data index of the first card from deck
  //We either fill this as we go along or we will use a shuffler to discover it all at once
  shuffledOrder: number[] = [];

  //Linked copy, used for branches from hypotheticals
  hypothetical?: GameTracker;

  init(state: GameState) {
    //Build deck
    this.cards = buildDeck(state.definition.variant);
    //Init stacks
    this.stacks = state.definition.variant.suits.map<number[]>(_ => ([]));
  }

  getLatestPlayerHand(player: number) {
    return this.getHandState(player, this.turnsProcessed);
  }

  private processDealEvent(definition: GameDefinition) {
    //Turn 0, Deal
    this.handHistories = [];
    for (let p = 0; p < definition.variant.numPlayers; p++) {
      this.handHistories[p] = [{
        turn: 0,
        result: []
      }];
      for (let s = 0; s < definition.variant.handSize; s++) {
        this.handHistories[p][0].result.push(this.topDeck);
        this.topDeck++;
      }
    }
  }

  private processPlayEvent(player: number, event: GamePlayEvent){
    //Create copy of current hand to make new hand
    let newHand = Array.from(this.handHistories[player][this.handHistories[player].length - 1].result);
    //Remove played card from hand
    let card = newHand.splice(event.handSlot, 1)[0];
    if (event.result === GamePlayResultType.Success){
      //If it was a successful play, add card to proper stack
      this.stacks[event.stack].push(card);
    } else if (event.result === GamePlayResultType.Misplay){
      //if it was a missplay put it in the discard pile 
      this.discardPile.push({index: card, turn: this.turnsProcessed});
    }
    //Put card on top of deck in leftmost slot
    newHand.unshift(this.topDeck);
    //Update the players hand
    this.handHistories[player].push({
      turn: this.turnsProcessed,
      result: newHand,
      played: event.handSlot,
      replacement: this.topDeck
    });
    //Mark off another from the deck
    this.topDeck++;
  }

  private processDiscardEvent(player: number, event: GameDiscardEvent){
    //Create copy of current hand to make new hand
    let newHand = Array.from(this.handHistories[player][this.handHistories[player].length - 1].result);
    //Remove  discarded card from hand
    let card = newHand.splice(event.handSlot, 1)[0];
    //Put it in the discard pile
    this.discardPile.push({index: card, turn: this.turnsProcessed});
    //Put card on top of deck in leftmost slot
    newHand.unshift(this.topDeck);
    //Update the players hand
    this.handHistories[player].push({
      turn: this.turnsProcessed,
      result: newHand,
      played: event.handSlot,
      replacement: this.topDeck
    });
    //Mark off another from the deck
    this.topDeck++;
  }

  propagateState(state: GameState) {
    let messages = state.events;
    let newEvents = false;
    for (this.turnsProcessed; this.turnsProcessed < messages.length; this.turnsProcessed++) {
      newEvents = true;
      const { event, reveals } = messages[this.turnsProcessed];
      let player = (event.turn - 1) % state.definition.variant.numPlayers;
      //Process Actions
      switch (event.type) {
        case GameEventType.Deal:
          this.processDealEvent(state.definition);
          break;
        case GameEventType.Play:
          this.processPlayEvent(player, event);
          break;
        case GameEventType.Discard:
          this.processDiscardEvent(player, event);
          break;
      }
      //Process Reveals
      if (reveals) {
        for (let revealedCard of reveals) {
          this.knownDeckOrder[revealedCard.deck] = revealedCard.card;
        }
      }
    }
    //If we processed new events, notify the frontend changes happened
    return newEvents;
  }

  getCardDataFromDeck(index: number) {
    //if shuffle order known
    if (this.shuffledOrder) {
      return this.cards[this.shuffledOrder[index]];
    } else {
      return undefined;
    }
  }

  //get the players hand state as of a given turn
  getHandState(player: number, turn: number) {
    //We are looking for the last turn where this players hand was updated, but before the given turn number
    let handHistoryIndex = 0;
    for (let i = 1; i < this.handHistories[player].length; i++) {
      if (this.handHistories[player][i].turn <= turn) {
        handHistoryIndex = i;
      } else {
        break;
      }
    }
    return this.handHistories[player][handHistoryIndex].result;
  }

  getCardInHand(player: number, index: number, turn: number) {
    const cardIndex = this.getHandState(player, turn)[index];
    return cardIndex;
  }

  useShuffler(si: ShufflerInput = undefined) {
    const { order } = getShuffledOrder(this.cards.length, si);
    this.shuffledOrder = order;
  }
}


