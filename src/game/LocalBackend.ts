import BackendInterface from "./BackendInterface"
import { GameTracker } from "./Game";
import { CardData, CardReveal, GameDefinition, GameState, VariantDefinition, GameEventSeries, GameActionType } from "./GameTypes"
import { buildDeck, getShuffledOrder } from "./VariantBuilding";

//Will be the substitute for a server in these local games
class Server {
  variant: VariantDefinition;

  deck: CardData[];
  shuffleOrder: number[];
  seed: number;

  stacks: number[][];
  hands: number[][];
  discard: number[];
  topDeck: number;
  lastTurn: number;

  events: GameEventSeries;
  constructor(definition: GameDefinition) {
    //Variant Info
    this.variant = definition.variant;

    //Build Deck
    this.deck = buildDeck(this.variant);
    const {order, seed} = getShuffledOrder(this.deck.length);
    this.shuffleOrder = order;
    this.seed = seed;

    //Build Server side game state
    this.stacks = [...Array(this.variant.suits.length)].map(_=>[]);
    this.discard = [];
    this.hands = [];
    this.topDeck = 0;

    const initialReveals: CardReveal[] = [];
    for (let p = 0; p < this.variant.numPlayers; p++) {
      this.hands[p] = [];
      for (let s = 0; s < this.variant.handSize; s++) {
        this.hands[p].push(this.topDeck);
        initialReveals.push({
          deck: this.topDeck,
          card: this.shuffleOrder[this.topDeck]
        });
        this.topDeck++;
      }
    }

    //Set turn 0 as a pure reveal, of the cards in everyones hands
    this.events = [{
      type: GameActionType.Deal, 
      reveals: initialReveals
    }];
    this.lastTurn = 0;
  }

  getAllEvents(){
    return this.events;
  }
}

//Meant for dictating logic of local games or template games
export default class LocalBackend implements BackendInterface {
  #state: GameState;
  #game?: GameTracker;

  #server: Server;

  constructor(definition: GameDefinition) {
    this.#server = new Server(definition);
    this.#state = {
      events: this.#server.getAllEvents(),
      definition
    };
  }

  currentState(): GameState {
    return this.#state;
  }

  bind(game: GameTracker) {
    this.#game = game;
  }
}
