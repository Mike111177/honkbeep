import BackendInterface from "./BackendInterface";
import FrontendInterface from "./FrontendInterface"
import {
  CardData,
  Stack,
  CardKnowledgeHistory,
  HandHistory,
  ShufflerInput,
  GameEvent,
  GameEventType,
  PlayResultType,
} from "./GameTypes";
import { buildDeck, getShuffledOrder } from "./VariantBuilding";

// Calculates current board state as new turns are played
export class GameTracker {
  #backend: BackendInterface;
  #frontend: FrontendInterface;

  turnsProcessed: number = 0;


  topDeck: number = 0;

  //Array the size of the whole deck, 
  //each player not know the value of each card, but they 
  //do know where every card is, so this should provide a 
  //stable memoizable lookup table
  cardKnowledge: CardKnowledgeHistory[] = [];
  handHistories: HandHistory[];

  //Unshuffled deck information
  cards: CardData[];

  knownDeckOrder: number[];

  stacks: Stack[];

  //Shuffled order of deck for spectator and review mode, and displaying discovered cards
  //Ergo shuffledOrder[0] contains the card data index of the first card from deck
  //We either fill this as we go along or we will use a shuffler to discover it all at once
  shuffledOrder: number[] = [];

  //Linked copy, used for branches from hypotheticals
  hypothetical?: GameTracker;

  constructor(backend: BackendInterface, frontend: FrontendInterface) {
    this.#backend = backend;
    this.#backend.bind(this);

    this.#frontend = frontend;
    this.#frontend.bind(this);

    let state = backend.currentState();
    this.cards = buildDeck(state.definition.variant);
    this.knownDeckOrder = [];

    //Init stacks
    this.stacks = state.definition.variant.suits.map<number[]>(_ => ([]));

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

    //Process State
    this.propagateState();
  }

  getLatestPlayerHand(player: number) {
    return;
  }

  propagateState() {
    let events = this.#backend.currentState().events;
    let newEvents = false;
    for (this.turnsProcessed; this.turnsProcessed < events.length; this.turnsProcessed++) {
      newEvents = true;
      let event = events[this.turnsProcessed];
      //Process Actions
      switch (event.type) {
        case GameEventType.Play:
          let newHand = Array.from(this.handHistories[event.player][this.handHistories[event.player].length - 1].result);
          let card = newHand.splice(event.handSlot, 1)[0];
          if (event.result.type === PlayResultType.Success){
            this.stacks[event.result.stack].push(card);
          }
          newHand.unshift(this.topDeck)
          this.handHistories[event.player].push({
            turn: this.turnsProcessed,
            result: newHand,
            played: event.handSlot,
            replacement: this.topDeck
          });
          this.topDeck++;
      }
      //Process Reveals
      if (event.reveals) {
        for (let revealedCard of event.reveals) {
          this.knownDeckOrder[revealedCard.deck] = revealedCard.card;
        }
      }
    }
    //If we processed new events, notify the frontend changes happened
    if (newEvents) {
      this.#frontend.onGameStateChange();
    }
  }

  getCardDataFromDeck(index: number) {
    //if shuffle order known
    if (this.shuffledOrder) {
      return this.cards[this.shuffledOrder[index]];
    } else {
      return undefined;
    }
  }

  getHandState(player: number, turn: number) {
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

  isPossiblyPlayable(cardIndex: number) { return true; }
  isCardRevealed(cardIndex: number) { return this.knownDeckOrder[cardIndex] !== undefined; }
  getSuits() { return this.#backend.currentState().definition.variant.suits; }
  getHandSize() { return this.#backend.currentState().definition.variant.handSize; }
  getPlayerNames() { return this.#backend.currentState().definition.playerNames; }

  //Frontend Action Endpoint
  async attemptPlayerAction(action: GameEvent) {
    return this.#backend.attemptPlayerAction(action);
  }

  //Backend Endpoints
  onNewEvents() {
    this.propagateState();
  }
}


