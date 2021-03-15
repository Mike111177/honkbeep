import {
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
import { getShuffledOrder } from "./DeckBuilding";
import { GameState, initGameStateFromDefinition, reduceGameEvent } from "./GameState";
import ArrayUtil from "../util/ArrayUtil";

type PlayerRevealTurn = {
  turn: number;
  reveals: CardReveal[];
}

type PlayerRevealHistory = PlayerRevealTurn[];

//Will be the substitute for a server in these local games
export default class LocalServer {
  private definition: GameDefinition;

  private shuffleOrder: number[];
  private seed: number;

  private events: GameEvent[];
  private reveals: PlayerRevealHistory[];

  //TODO: transfer all possible state to be managed by this state
  private state: GameState;

  private connections: {
    player: number;
    callback: (e: GameEventMessage) => void;
  }[];

  constructor(definition: GameDefinition, deckDef?: number | { order: number[]; seed: number }) {
    //Variant Info
    this.definition = definition;

    //Build Server side game state
    this.events = [{ turn: 0, type: GameEventType.Deal }];
    this.state = reduceGameEvent(initGameStateFromDefinition(definition), this.getLatestEvent());

    //Order Deck
    if (deckDef === undefined || typeof deckDef === "number") {
      const shuffle = getShuffledOrder(this.state.deck.length, deckDef);
      this.shuffleOrder = shuffle.order;
      this.seed = shuffle.seed;
    } else {
      this.shuffleOrder = deckDef.order;
      this.seed = deckDef.seed;
    }

    //Build reveals
    this.reveals = ArrayUtil.fill(this.definition.variant.numPlayers, () => []);
    this.state.hands.forEach((hand, player) => {
      hand.forEach(card => {
        this.revealCardToAllButOnePlayer(card, player, 0);
      });
    });

    //Setup client connections
    this.connections = [];
  }

  private revealCardToPlayer(card: number, player: number, turn: number = this.state.turn) {
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

  private revealCardToAllButOnePlayer(card: number, player: number, turn: number = this.state.turn) {
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
    for (let i = 0; i < this.state.turn; i++) {
      history.push(this.buildEventMessage(player, i));
    }
    return history;
  }
  private getLatestEvent() {
    return this.events[this.events.length - 1];
  }

  private isPlayersTurn(player: number) {
    return player === (this.state.turn-1) % this.definition.variant.numPlayers;
  }

  private cardFromHand(player: number, handSlot: number) {
    return this.state.hands[player][handSlot];
  }

  private getCardIndexFromDeckIndex(index: number) {
    return this.shuffleOrder[index];
  }

  private getCardInfoFromDeckIndex(index: number) {
    return this.state.deck.getCard(this.getCardIndexFromDeckIndex(index));
  }

  private getLastCardOnStack(stack: number) {
    return this.state.stacks[stack][this.state.stacks[stack].length - 1];
  }

  //Obviously will become more complicated as variants are implemented
  private isCardPlayableOnStack(card: number, stack: number) {
    const cardInfo = this.getCardInfoFromDeckIndex(card);
    const suit = this.definition.variant.suits[stack];
    if (suit === cardInfo.suit) {
      if (this.state.stacks[stack].length === 0) {
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
    const { card } = action;
    //Make sure card is actually in player hand
    if (this.state.hands[player].find(i => i === card) === undefined) return false;
    //Try to play card on each stack, until we find one that works
    let cardWasPlayed = false;
    for (let i = 0; i < this.definition.variant.suits.length; i++) {
      if (this.isCardPlayableOnStack(card, i)) {
        this.events.push({
          turn: this.state.turn,
          type: GameEventType.Play,
          result: GamePlayResultType.Success,
          stack: i,
          card: card
        });
        cardWasPlayed = true;
        break;
      }
    }
    //If it matched no stacks, this is a misplay, it goes to discard
    if (!cardWasPlayed) {
      this.events.push({
        turn: this.state.turn,
        type: GameEventType.Play,
        result: GamePlayResultType.Misplay,
        card: card
      });
    }
    //Reveal the played card to player
    this.revealCardToPlayer(card, player);
    //Reveal the card replacing it in his hand to the rest of the players
    this.revealCardToAllButOnePlayer(this.state.topDeck, player);
    return true;
  }

  private attemptDiscard(player: number, action: GameDiscardEvent) {
    //Check to make sure its this players turn
    if (!this.isPlayersTurn(player)) return false;
        //Get the card the player is trying to play
    const { card } = action;
    //Make sure card is actually in player hand
    if (this.state.hands[player].find(i => i === card) === undefined) return false;
    this.events.push({
      type: GameEventType.Discard,
      turn: this.state.turn,
      card,
    });
    //Reveal the played card to player
    this.revealCardToPlayer(card, player);
    //Reveal the card replacing it in his hand to the rest of the players
    this.revealCardToAllButOnePlayer(this.state.topDeck, player);
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
    const targetHand = this.state.hands[target];
    let touched = targetHand.filter(card => doesClueMatchCard(clue, this.getCardInfoFromDeckIndex(card)));

    //If no cards were touched, this clue is illegal
    if (touched.length === 0) return false;

    //Create the cluining
    this.events.push({
      turn: this.state.turn,
      type: GameEventType.Clue,
      clue,
      target,
      touched
    });
    return true;
  }

  private async broadcastLatestEvent() {
    let turn = this.state.turn - 1;
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
      this.state = reduceGameEvent(this.state, this.getLatestEvent());
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
