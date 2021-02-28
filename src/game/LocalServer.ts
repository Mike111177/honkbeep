import {
  CardData,
  CardReveal,
  GameDefinition,
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
export default class LocalServer {
  private definition: GameDefinition;

  private deck: CardData[];
  private shuffleOrder: number[];
  private seed: number;

  private stacks: number[][];
  private hands: number[][];
  private discard: number[];
  
  private topDeck: number;
  private lastTurn: number;

  private events: GameEventSeries;

  constructor(definition: GameDefinition) {
    //Variant Info
    this.definition = definition;

    //Build Deck
    this.deck = buildDeck(this.definition.variant);
    const { order, seed } = getShuffledOrder(this.deck.length);
    this.shuffleOrder = order;
    this.seed = seed;

    //Build Server side game state
    this.stacks = [...Array(this.definition.variant.suits.length)].map(_ => []);
    this.discard = [];
    this.hands = [];
    this.topDeck = 0;

    //Build initial hands and reveals
    const initialRevealedCards: CardReveal[][] = [...Array(this.definition.variant.numPlayers)].map(_ => []);
    for (let playerOfHand = 0; playerOfHand < this.definition.variant.numPlayers; playerOfHand++) {
      //Create hand for player
      const thisHand: number[] = [];
      for (let slotOfPlayerHand = 0; slotOfPlayerHand < this.definition.variant.handSize; slotOfPlayerHand++) {
        //Add each card to player hand
        thisHand.push(this.topDeck);
        for (let playerOfReveal = 0; playerOfReveal < this.definition.variant.numPlayers; playerOfReveal++) {
          //Reveal each card to each player other than the one of this hand
          if (playerOfReveal !== playerOfHand) {
            initialRevealedCards[playerOfReveal].push({
              player: playerOfReveal,
              turn: 0,
              deck: this.topDeck,
              card: this.shuffleOrder[this.topDeck]
            });
          }
        }
        this.topDeck++;
      }
      this.hands[playerOfHand] = thisHand;
    }
    
    //Set turn 0 as a pure reveal, of the cards in everyone's hands
    this.events = [{
      type: GameEventType.Deal,
      reveals: initialRevealedCards
    }];
    this.lastTurn = 0;
  }

  private getLatestEvent() {
    return this.events[this.events.length - 1];
  }

  private isPlayersTurn(player: number) {
    return player === this.lastTurn % this.definition.variant.numPlayers;
  }

  private cardFromHand(player: number, handSlot: number) {
    return this.hands[player][handSlot];
  }

  private getCardIndexFromDeckIndex(index: number) {
    return this.shuffleOrder[index];
  }

  private cardInfoFromDeckIndex(index: number) {
    return this.deck[this.getCardIndexFromDeckIndex(index)];
  }

  private getLastCardOnStack(stack: number) {
    return this.stacks[stack][this.stacks[stack].length - 1];
  }

  //Obviously will become more complicated as variants are implemented
  private isCardPlayableOnStack(card: number, stack: number) {
    const cardInfo = this.cardInfoFromDeckIndex(card);
    const suit = this.definition.variant.suits[stack];
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

  private attemptPlay(action: GamePlayEvent) {
    //Check to make sure its this players turn
    if (!this.isPlayersTurn(action.player)) return false;
    //Check if card is playable
    const attemptedPlayIndex = this.cardFromHand(action.player, action.handSlot);
    let cardWasPlayed = false;
    for (let i = 0; i < this.definition.variant.suits.length; i++) {
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
          reveals: [[
            { //Reveal played card to player
              player: action.player,
              turn: this.lastTurn + 1,
              deck: attemptedPlayIndex,
              card: this.getCardIndexFromDeckIndex(attemptedPlayIndex)
            },
            { // Reveal new card to all
              player: action.player,
              turn: this.lastTurn + 1,
              deck: this.topDeck,
              card: this.getCardIndexFromDeckIndex(this.topDeck)
            }
          ]]
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
        reveals: [[
          { //Reveal played card to all
            player: action.player,
            turn: this.lastTurn + 1,
            deck: attemptedPlayIndex,
            card: this.getCardIndexFromDeckIndex(attemptedPlayIndex)
          },
          { // Reveal new card to all
            player: action.player,
            turn: this.lastTurn + 1,
            deck: this.topDeck,
            card: this.getCardIndexFromDeckIndex(this.topDeck)
          }
        ]]
      });
    }
    this.topDeck++;
    this.lastTurn++;
    return true;
  }

  private attemptDiscard(action: GameDiscardEvent) {
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
      reveals: [[
        { //Reveal played card to all
          player: action.player,
          turn: this.lastTurn + 1,
          deck: attemptedPlayIndex,
          card: this.getCardIndexFromDeckIndex(attemptedPlayIndex)
        },
        { // Reveal new card to all
          player: action.player,
          turn: this.lastTurn + 1,
          deck: this.topDeck,
          card: this.getCardIndexFromDeckIndex(this.topDeck)
        }
      ]]
    });
    this.topDeck++;
    this.lastTurn++;
    return true;
  }

  public async attemptPlayerAction(action: GameEvent) {
    switch (action.type) {
      case GameEventType.Play:
        return this.attemptPlay(action);
      case GameEventType.Discard:
        return this.attemptDiscard(action);
    }
    return false;
  }

  public async requestInitialState(player: number) {
    return {
      definition: this.definition,
      events: this.events
    };
  }
}
