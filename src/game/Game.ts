import React from "react";
import xorshift32 from "./xorshift32";

type CardData = {
  rank: number,
  suit: string
};

type SuitData = string;

type VariantDefinition = {
  suits: SuitData[],
  numPlayers: number,
  handSize: number
}

export type GameDefinition = {
  variant: VariantDefinition,
  playerNames: string[],
}
//May either be a seed or undefined
type ShufflerInput = number | undefined;
//If you are given a GameDefinition and a ShufflerInput
//You should be able to derive the entire deck order
//Meant for spectators and post game review

type GameAction = {
  description: string
}
type GameEventSeries = GameAction[];

//Minimum data to construct entire game state
type GameState = {
  events: GameEventSeries,
  definition: GameDefinition
}

enum PipStatus {
  Possible = 1,
  Impossible,
  KnownImpossible
}

enum CardDestination {
  Deck = 1,
  Hand,
  Stacks,
  Discard
}

type HandUpdate = {
  turn: number, //The turn this update was made on / this should be unique in a hands history
  played?: number, //Card that was played to cause this hand state
  destination?: CardDestination // Where the card went
  replacement?: number, //Card that replaced slot 1 from deck
  result: number[] //Cards (by deck index) in hand after play
}

type HandHistory = HandUpdate[]

type CardKnowledgeUpdate = {
  turn: number, //The turn this update was made on / this should be unique in a cards history
  pips: PipStatus
}

type CardKnowledgeHistory = CardKnowledgeUpdate[];

type Stack = {
  suit: SuitData,
  cards: number[]
}

// Calculates current board state as new turns are played
export class GameTracker {
  state: GameState;
  turn: number = 0;
  topDeck: number = 0;

  //Array the size of the whole deck, 
  //each player not know the value of each card, but they 
  //do know where every card is, so this should provide a 
  //stable memoizable lookup table
  cardKnowledge: CardKnowledgeHistory[] = [];
  handHistories: HandHistory[];

  //Unshuffled deck information
  cards: CardData[];

  stacks: Stack[];

  //Shuffled order of deck for spectator and review mode, and displaying discovered cards
  //Ergo shuffledOrder[0] contains the card data index of the first card from deck
  //We either fill this as we go along or we will use a shuffler to discover it all at once
  shuffledOrder: number[] = [];

  //Linked copy, used for branches from hypotheticals
  hypothetical?: GameTracker;

  constructor(definition: GameDefinition) {
    this.state = {
      events: [],
      definition
    };
    this.cards = buildDeck(this.state.definition.variant);

    //Init stacks
    this.stacks = this.state.definition.variant.suits.map(s => ({
      suit: s,
      cards: []
    }));

    //Turn 0, Deal
    this.handHistories = [];
    for (let p = 0; p < this.state.definition.variant.numPlayers; p++) {
      this.handHistories[p] = [{
        turn: 0,
        result: []
      }];
      for (let s = 0; s < this.state.definition.variant.handSize; s++) {
        this.handHistories[p][0].result.push(this.topDeck);
        this.topDeck++;
      }
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
    this.shuffledOrder = getShuffledOrder(this.cards.length, si);
  }
  
  isPossiblyPlayable(cardIndex:number){
    return true;
  }
}

function buildDeck({ suits }: VariantDefinition) {
  let deck = suits.map(suit => (
    [1, 1, 1, 2, 2, 3, 3, 4, 4, 5].map(rank => (
      { suit, rank }
    ))
  )).flat();
  return deck;
}

function getShuffledOrder(length: number, seed: ShufflerInput = undefined) {
  let rng = new xorshift32(seed);
  let order = [...Array(length).keys()];
  for (let i = 0; i < length; i++) {
    let s = rng.next() % (length - 1);
    let tmp = order[s];
    order[s] = order[i];
    order[i] = tmp;
  }
  return order;
}

export class GameUIInterface {
  game?: GameTracker;
  constructor(game?: GameTracker) {
    this.game = game;
  }
  getPlayerNames() {
    return this.game?.state.definition.playerNames ?? ["Alice", "Bob", "Cathy", "Donald", "Emily"];
  }
  getSuits() {
    return this.game?.state.definition.variant.suits ?? ["Red"];
  }
  getCardsPerHand() {
    return this.game?.state.definition.variant.handSize ?? 1;
  }
  getCardInHand(player: number, index: number) {
    if (this.game) {
      return this.game.getCardInHand(player, index, this.game.turn);
    } else {
      return 0;
    }
  }
  getCardDisplayableProps(index: number) {
    if (this.game) {
      if (this.game.shuffledOrder[index]) {
        let info = this.game.cards[this.game.shuffledOrder[index]];
        return info;
      }
    }
    return { rank: 1, suit: "Purple" };
  }

  //Return method for handslots to attempt to play a card
  useHandSlot(player: number, index: number) {
    return ((p: number, i: number) => {
      return () => {

      };
    })(player, index);
  }
}
export const GameUIContext = React.createContext<GameUIInterface>(new GameUIInterface());
