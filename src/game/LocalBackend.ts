import BackendInterface from "./BackendInterface";
import { GameTracker } from "./Game";
import {
  CardData,
  CardReveal,
  GameDefinition,
  GameState,
  VariantDefinition,
  GameEventSeries,
  GameEventType,
  GameEvent,
  PlayResultType,
  GamePlayEvent,
  GameDiscardEvent,
  DiscardResultType
} from "./GameTypes";
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
    const { order, seed } = getShuffledOrder(this.deck.length);
    this.shuffleOrder = order;
    this.seed = seed;

    //Build Server side game state
    this.stacks = [...Array(this.variant.suits.length)].map(_ => []);
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

    //Set turn 0 as a pure reveal, of the cards in everyone's hands
    this.events = [{
      type: GameEventType.Deal,
      reveals: initialReveals
    }];
    this.lastTurn = 0;
  }

  getLatestEvent() {
    return this.events[this.events.length - 1];
  }

  isPlayersTurn(player: number) {
    return player === this.lastTurn % this.variant.numPlayers;
  }

  cardFromHand(player: number, handSlot: number) {
    return this.hands[player][handSlot];
  }

  getCardIndexFromDeckIndex(index: number) {
    return this.shuffleOrder[index];
  }

  cardInfoFromDeckIndex(index: number) {
    return this.deck[this.getCardIndexFromDeckIndex(index)];
  }

  getLastCardOnStack(stack: number) {
    return this.stacks[stack][this.stacks[stack].length - 1];
  }

  //Obviously will become more complicated as variants are implemented
  isCardPlayableOnStack(card: number, stack: number) {
    const cardInfo = this.cardInfoFromDeckIndex(card);
    const suit = this.variant.suits[stack];
    if (suit === cardInfo.suit) {
      if (this.stacks[stack].length === 0) {
        if (cardInfo.rank === 1) {
          return true;
        }
      } else {
        const { rank } = this.cardInfoFromDeckIndex(this.getLastCardOnStack(stack));
        if (rank === cardInfo.rank - 1) {
          return true;
        }
      }
    }
    return false;
  }

  attemptPlay(action: GamePlayEvent) {
    //Check to make sure its this players turn
    if (!this.isPlayersTurn(action.player)) return false;
    //Check if card is playable
    const attemptedPlayIndex = this.cardFromHand(action.player, action.handSlot);
    let cardWasPlayed = false;
    for (let i = 0; i < this.variant.suits.length; i++) {
      if (this.isCardPlayableOnStack(attemptedPlayIndex, i)) {
        //Remove Card from Hand
        this.hands[action.player].splice(action.handSlot, 1);
        //Add card to end of stack
        this.stacks[i].push(attemptedPlayIndex);
        //Replace card in hand with the card at the top of the deck
        this.hands[action.player].unshift(this.topDeck);
        //Build new event and add it to event list
        this.events.push({
          type: GameEventType.Play,
          player: action.player,
          handSlot: action.handSlot,
          result: {
            type: PlayResultType.Success,
            stack: i
          },
          reveals: [
            { //Reveal played card to all
              deck: attemptedPlayIndex,
              card: this.getCardIndexFromDeckIndex(attemptedPlayIndex)
            },
            { // Reveal new card to all
              deck: this.topDeck,
              card: this.getCardIndexFromDeckIndex(this.topDeck)
            }
          ]
        });
        cardWasPlayed = true;
        break;
      }
    }
    if (!cardWasPlayed) {
      //Well it wasn't playable, misplay time
      this.hands[action.player].splice(action.handSlot, 1);
      //Add card to end of discard
      this.discard.push(attemptedPlayIndex);
      //Replace card in hand with the card at the top of the deck
      this.hands[action.player].unshift(this.topDeck);
      //Build new event and add it to event list
      this.events.push({
        type: GameEventType.Play,
        player: action.player,
        handSlot: action.handSlot,
        result: {
          type: PlayResultType.Misplay
        },
        reveals: [
          { //Reveal played card to all
            deck: attemptedPlayIndex,
            card: this.getCardIndexFromDeckIndex(attemptedPlayIndex)
          },
          { // Reveal new card to all
            deck: this.topDeck,
            card: this.getCardIndexFromDeckIndex(this.topDeck)
          }
        ]
      });
    }
    this.topDeck++;
    this.lastTurn++;
    return true;
  }

  attemptDiscard(action: GameDiscardEvent) {
    //Check to make sure its this players turn
    if (!this.isPlayersTurn(action.player)) return false;
    //Check if card is playable
    const attemptedPlayIndex = this.cardFromHand(action.player, action.handSlot);
    //Remove Card from Hand
    this.hands[action.player].splice(action.handSlot, 1);
    //Add card to end of discard
    this.discard.push(attemptedPlayIndex);
    //Replace card in hand with the card at the top of the deck
    this.hands[action.player].unshift(this.topDeck);
    //Build new event and add it to event list
    this.events.push({
      type: GameEventType.Discard,
      player: action.player,
      handSlot: action.handSlot,
      result: {
        type: DiscardResultType.Success
      },
      reveals: [
        { //Reveal played card to all
          deck: attemptedPlayIndex,
          card: this.getCardIndexFromDeckIndex(attemptedPlayIndex)
        },
        { // Reveal new card to all
          deck: this.topDeck,
          card: this.getCardIndexFromDeckIndex(this.topDeck)
        }
      ]
    });
    this.topDeck++;
    this.lastTurn++;
    return true;
  }

  async attemptPlayerAction(action: GameEvent) {
    switch (action.type) {
      case GameEventType.Play:
        return this.attemptPlay(action);
      case GameEventType.Discard:
        return this.attemptDiscard(action);
    }
    return false;
  }
}

//Meant for dictating logic of local games or template games
export default class LocalBackend implements BackendInterface {
  private state: GameState;
  private game?: GameTracker;
  private server: Server;

  constructor(definition: GameDefinition) {
    this.server = new Server(definition);
    this.state = {
      events: this.server.events,
      definition
    };
  }

  currentState(): GameState {
    return this.state;
  }

  bind(game: GameTracker) {
    this.game = game;
  }

  async attemptPlayerAction(action: GameEvent) {
    const actionSuccess = await this.server.attemptPlayerAction(action);
    if (actionSuccess) {
      this.game!.onNewEvents();
    }
    return actionSuccess;
  }
}
