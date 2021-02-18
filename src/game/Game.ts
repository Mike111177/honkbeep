import xorshift32 from "../util/xorshift32";
import FrontendInterface from "./FrontendInterface"
import {
  CardData,
  GameState,
  Stack,
  CardKnowledgeHistory,
  HandHistory,
  GameDefinition,
  ShufflerInput,
  VariantDefinition
} from "./GameTypes";

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

  frontend: FrontendInterface;

  constructor(definition: GameDefinition, frontend: FrontendInterface) {
    this.state = {
      events: [],
      definition
    };
    this.frontend = frontend;
    this.frontend.bind(this);

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
