import {
  CardData,
  CardReveal,
  GameDefinition,
  GameEventType,
  GameEvent,
  GameDiscardEvent,
  GameAttempt,
  GamePlayAttempt,
  GameEventMessage,
  GamePlayResultType,
  GameClueAttempt
} from "./GameTypes";
import { doesClueMatchCard } from "./Rules";
import { buildDeck, getShuffledOrder } from "./DeckBuilding";

type PlayerRevealTurn = {
  turn: number;
  reveals: CardReveal[];
}

type PlayerRevealHistory = PlayerRevealTurn[];

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

  private events: GameEvent[];
  private reveals: PlayerRevealHistory[];

  private connections: {
    player: number;
    callback: (e: GameEventMessage) => void;
  }[];

  constructor(definition: GameDefinition, seed?: number) {
    //Variant Info
    this.definition = definition;

    //Build Deck
    this.deck = buildDeck(this.definition.variant);
    const shuffle = getShuffledOrder(this.deck.length, seed);
    this.shuffleOrder = shuffle.order;
    this.seed = shuffle.seed;

    //Build Server side game state
    this.stacks = [...Array(this.definition.variant.suits.length)].map(_ => []);
    this.discard = [];
    this.hands = [];
    this.topDeck = 0;

    //Build initial hands and reveals
    this.reveals = [...Array(this.definition.variant.numPlayers)].map(_ => [{ turn: 0, reveals: [] }]);
    for (let playerOfHand = 0; playerOfHand < this.definition.variant.numPlayers; playerOfHand++) {
      //Create hand for player
      const thisHand: number[] = [];
      for (let slotOfPlayerHand = 0; slotOfPlayerHand < this.definition.variant.handSize; slotOfPlayerHand++) {
        //Add each card to player hand
        thisHand.push(this.topDeck);
        this.revealCardToAllButOnePlayer(this.topDeck, playerOfHand, 0);
        this.topDeck++;
      }
      this.hands[playerOfHand] = thisHand;
    }

    this.events = [{ turn: 0, type: GameEventType.Deal }];
    this.lastTurn = 0;

    this.connections = [];
  }

  private revealCardToPlayer(card: number, player: number, turn: number = this.lastTurn + 1) {
    let revs = this.reveals[player].find(el => el.turn === turn);
    if (revs === undefined) {
      let nIndex = this.reveals[player].push({ turn, reveals: [] }) - 1;
      revs = this.reveals[player][nIndex];
    }
    revs.reveals.push({
      deck: card,
      card: this.shuffleOrder[card]
    });
  }

  private revealCardToAllButOnePlayer(card: number, player: number, turn: number = this.lastTurn + 1) {
    for (let playerOfReveal = 0; playerOfReveal < this.definition.variant.numPlayers; playerOfReveal++) {
      //Reveal each card to each player other than the one named
      if (playerOfReveal !== player) {
        this.revealCardToPlayer(card, playerOfReveal, turn);
      }
    }
  }

  private getReveals(player: number, turn: number) {
    return this.reveals[player].find(el => el.turn === turn)?.reveals;
  }

  private buildEventMessage(player: number, turn: number): GameEventMessage {
    return {
      event: this.events[turn],
      reveals: this.getReveals(player, turn)
    };
  }
  private buildStateHistory(player: number): GameEventMessage[] {
    let history = [];
    for (let i = 0; i < this.lastTurn + 1; i++) {
      history.push(this.buildEventMessage(player, i));
    }
    return history;
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

  private getCardInfoFromDeckIndex(index: number) {
    return this.deck[this.getCardIndexFromDeckIndex(index)];
  }

  private getLastCardOnStack(stack: number) {
    return this.stacks[stack][this.stacks[stack].length - 1];
  }

  //Obviously will become more complicated as variants are implemented
  private isCardPlayableOnStack(card: number, stack: number) {
    const cardInfo = this.getCardInfoFromDeckIndex(card);
    const suit = this.definition.variant.suits[stack];
    if (suit === cardInfo.suit) {
      if (this.stacks[stack].length === 0) {
        if (cardInfo.rank === 1) {
          return true;
        }
      } else {
        const { rank } = this.getCardInfoFromDeckIndex(this.getLastCardOnStack(stack));
        if (rank === cardInfo.rank - 1) {
          return true;
        }
      }
    }
    return false;
  }

  private attemptPlay(player: number, action: GamePlayAttempt) {
    //Check to make sure its this players turn
    if (!this.isPlayersTurn(player)) return false;
    //Get the card the player is trying to play
    const attemptedPlayIndex = this.cardFromHand(player, action.handSlot);
    //Try to play card on each stack, until we find one that works
    let cardWasPlayed = false;
    for (let i = 0; i < this.definition.variant.suits.length; i++) {
      if (this.isCardPlayableOnStack(attemptedPlayIndex, i)) {
        //Remove Card from Hand
        this.hands[player].splice(action.handSlot, 1);
        //Add card to end of stack
        this.stacks[i].push(attemptedPlayIndex);
        //Replace card in hand with the card at the top of the deck
        this.hands[player].unshift(this.topDeck);
        //Build new event and add it to event list
        this.events.push({
          turn: this.lastTurn + 1,
          type: GameEventType.Play,
          result: GamePlayResultType.Success,
          stack: i,
          handSlot: action.handSlot
        });
        cardWasPlayed = true;
        break;
      }
    }
    //If it matched no stacks, this is a misplay, it goes to discard
    if (!cardWasPlayed) {
      //Well it wasn't playable, misplay time
      this.hands[player].splice(action.handSlot, 1);
      //Add card to end of discard
      this.discard.push(attemptedPlayIndex);
      //Replace card in hand with the card at the top of the deck
      this.hands[player].unshift(this.topDeck);
      //Build new event and add it to event list
      this.events.push({
        turn: this.lastTurn + 1,
        type: GameEventType.Play,
        result: GamePlayResultType.Misplay,
        handSlot: action.handSlot
      });
    }
    //Reveal the played card to player
    this.revealCardToPlayer(attemptedPlayIndex, player);
    //Reveal the card replacing it in his hand to the rest of the players
    this.revealCardToAllButOnePlayer(this.topDeck, player);
    this.topDeck++;
    this.lastTurn++;
    return true;
  }

  private attemptDiscard(player: number, action: GameDiscardEvent) {
    //Check to make sure its this players turn
    if (!this.isPlayersTurn(player)) return false;
    //Get the card the player is trying to play
    const attemptedPlayIndex = this.cardFromHand(player, action.handSlot);
    //Remove Card from Hand
    this.hands[player].splice(action.handSlot, 1);
    //Add card to end of discard
    this.discard.push(attemptedPlayIndex);
    //Replace card in hand with the card at the top of the deck
    this.hands[player].unshift(this.topDeck);
    //Build new event and add it to event list
    this.events.push({
      type: GameEventType.Discard,
      turn: this.lastTurn + 1,
      handSlot: action.handSlot,
    });
    //Reveal the played card to player
    this.revealCardToPlayer(attemptedPlayIndex, player);
    //Reveal the card replacing it in his hand to the rest of the players
    this.revealCardToAllButOnePlayer(this.topDeck, player);
    this.topDeck++;
    this.lastTurn++;
    return true;
  }

  private attemptClue(player: number, {clue, target}: GameClueAttempt) {
    //Check to make sure its this players turn
    if (!this.isPlayersTurn(player)) return false;
    //Make sure the player they are cluing exist
    if (target>= this.definition.variant.numPlayers) return false;
    //Make sure the player they are cluing is not themself
    if (target === player) return false;
    
    //See which cards in target hand get touched
    const targetHand = this.hands[target];
    let touched = targetHand.filter(card => doesClueMatchCard(clue, this.getCardInfoFromDeckIndex(card)));

    //If no cards were touched, this clue is illegal
    if (touched.length === 0) return false;

    //Create the cluining
    this.events.push({
      turn: this.lastTurn + 1,
      type: GameEventType.Clue,
      clue,
      target,
      touched
    });
    this.lastTurn++;
    return true;
  }

  private async broadcastLatestEvent() {
    let turn = this.lastTurn;
    this.connections.forEach(c => {
      let message = this.buildEventMessage(c.player, turn);
      c.callback(message);
    });
  }

  private processPlayerAction(player: number, action: GameAttempt): boolean {
    switch (action.type) {
      case GameEventType.Play:
        return this.attemptPlay(player, action);
      case GameEventType.Discard:
        return this.attemptDiscard(player, action);
      case GameEventType.Clue:
        return this.attemptClue(player, action);
      default:
        return false; //Invalid event, so obviously not valid attempt
    }
  }

  public async attemptPlayerAction(player: number, action: GameAttempt) {
    if (this.processPlayerAction(player, action)) {
      this.broadcastLatestEvent();
      return true;
    }
    return false;
  }

  public async requestInitialState(player: number) {
    return {
      definition: this.definition,
      events: this.buildStateHistory(player)
    };
  }

  public async connect(player: number, callback: (e: GameEventMessage) => void) {
    this.connections.push({ player, callback });
  }
}
