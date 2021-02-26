import {
  CardData,
  Stack,
  CardKnowledgeHistory,
  HandHistory,
  ShufflerInput,
  GameEventType,
  PlayResultType,
  GamePlayEvent,
  GameDiscardEvent,
  GameState,
} from "./GameTypes";
import { buildDeck, getShuffledOrder } from "./VariantBuilding";

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

  private processDealEvent(state: GameState) {
    //Turn 0, Deal
    this.handHistories = [];
    for (let p = 0; p < state.definition.variant.numPlayers; p++) {
      this.handHistories[p] = [{
        turn: 0,
        result: []
      }];
      for (let s = 0; s < state.definition.variant.handSize; s++) {
        this.handHistories[p][0].result.push(this.topDeck);
        this.topDeck++;
      }
    }
  }

  private processPlayEvent(event: GamePlayEvent){
    //Create copy of current hand to make new hand
    let newHand = Array.from(this.handHistories[event.player][this.handHistories[event.player].length - 1].result);
    //Remove played card from hand
    let card = newHand.splice(event.handSlot, 1)[0];
    if (event.result.type === PlayResultType.Success){
      //If it was a successful play, add card to proper stack
      this.stacks[event.result.stack].push(card);
    } else if (event.result.type === PlayResultType.Misplay){
      //if it was a missplay put it in the discard pile 
      this.discardPile.push({index: card, turn: this.turnsProcessed});
    }
    //Put card on top of deck in leftmost slot
    newHand.unshift(this.topDeck);
    //Update the players hand
    this.handHistories[event.player].push({
      turn: this.turnsProcessed,
      result: newHand,
      played: event.handSlot,
      replacement: this.topDeck
    });
    //Mark off another from the deck
    this.topDeck++;
  }

  private processDiscardEvent(event: GameDiscardEvent){
    //Create copy of current hand to make new hand
    let newHand = Array.from(this.handHistories[event.player][this.handHistories[event.player].length - 1].result);
    //Remove  discarded card from hand
    let card = newHand.splice(event.handSlot, 1)[0];
    //Put it in the discard pile
    this.discardPile.push({index: card, turn: this.turnsProcessed});
    //Put card on top of deck in leftmost slot
    newHand.unshift(this.topDeck);
    //Update the players hand
    this.handHistories[event.player].push({
      turn: this.turnsProcessed,
      result: newHand,
      played: event.handSlot,
      replacement: this.topDeck
    });
    //Mark off another from the deck
    this.topDeck++;
  }

  propagateState(state: GameState) {
    let events = state.events
    let newEvents = false;
    for (this.turnsProcessed; this.turnsProcessed < events.length; this.turnsProcessed++) {
      newEvents = true;
      let event = events[this.turnsProcessed];
      //Process Actions
      switch (event.type) {
        case GameEventType.Deal:
          this.processDealEvent(state);
          break;
        case GameEventType.Play:
          this.processPlayEvent(event);
          break;
        case GameEventType.Discard:
          this.processDiscardEvent(event);
          break;
      }
      //Process Reveals
      if (event.reveals) {
        for (let revealedCard of event.reveals[0]) {
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


