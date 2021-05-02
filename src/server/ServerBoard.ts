import {
  GameEvent,
  GameState,
  GameEventType,
  reduceGameEvent,
  initGameStateFromDefinition,
  getShuffledOrder,
  GameAttempt,
  resolveGameAttempt,
  Variant,
  VariantDefinition,
  buildVariant,
} from "../game";
import * as ArrayUtil from "../util/ArrayUtil";
import {
  CardReveal,
  GameData,
  GameEventMessage,
} from "../backend/types/GameData";
import { GameClientConnection } from "./types/GameClientConnection";

type PlayerRevealTurn = {
  turn: number;
  reveals: CardReveal[];
};

type PlayerRevealHistory = PlayerRevealTurn[];

//Will be the substitute for a server in these local games
export default class ServerBoard {
  private playerNames: ReadonlyArray<string>;
  private variantDef: VariantDefinition;
  private variant: Variant;

  private shuffleOrder: number[];
  private seed?: number;

  private events: GameEvent[];
  private reveals: PlayerRevealHistory[];

  //TODO: transfer all possible state to be managed by this state
  private state: GameState;

  private connections: GameClientConnection[];
  constructor(
    definition: VariantDefinition,
    playerNames: ReadonlyArray<string>,
    deckDef?: number | { order: number[]; seed?: number }
  ) {
    //Variant Info
    this.variantDef = definition;
    this.variant = buildVariant(this.variantDef);
    this.playerNames = playerNames;

    //Build Server side game state
    const dealEvent: GameEvent = { turn: 0, type: GameEventType.Deal };
    this.state = reduceGameEvent(
      initGameStateFromDefinition(this.variant),
      dealEvent,
      this.variant
    );
    this.events = [dealEvent];

    //Order Deck
    if (deckDef === undefined || typeof deckDef === "number") {
      const shuffle = getShuffledOrder(this.variant.deck.length);
      this.shuffleOrder = shuffle.order;
      this.seed = shuffle.seed;
    } else {
      this.shuffleOrder = deckDef.order;
      this.seed = deckDef.seed;
    }

    //Build reveals
    this.reveals = ArrayUtil.fill(this.variant.numPlayers, () => []);
    this.state.hands.forEach((hand, player) => {
      hand.forEach((card) => {
        this.revealCardToAllButOnePlayer(card, player, 0);
      });
    });

    //Setup client connections
    this.connections = [];
  }

  private revealCardToPlayer(
    card: number,
    player: number,
    turn: number = this.state.turn
  ) {
    let revs = this.reveals[player].find((el) => el.turn === turn);
    if (revs === undefined) {
      let nIndex = this.reveals[player].push({ turn, reveals: [] }) - 1;
      revs = this.reveals[player][nIndex];
    }
    revs.reveals.push({
      deck: card,
      card: this.shuffleOrder[card],
    });
  }

  private revealCardToAllButOnePlayer(
    card: number,
    player: number,
    turn: number = this.state.turn
  ) {
    for (
      let playerOfReveal = 0;
      playerOfReveal < this.variant.numPlayers;
      playerOfReveal++
    ) {
      //Reveal each card to each player other than the one named
      if (playerOfReveal !== player) {
        this.revealCardToPlayer(card, playerOfReveal, turn);
      }
    }
  }

  private getReveals(player: number, turn: number) {
    return this.reveals[player].find((el) => el.turn === turn)?.reveals;
  }

  private buildEventMessage(player: number, turn: number): GameEventMessage {
    return {
      event: this.events[turn],
      reveals: this.getReveals(player, turn),
    };
  }

  private buildStateHistory(player: number): GameEventMessage[] {
    let history = [];
    for (let i = 0; i < this.state.turn; i++) {
      history.push(this.buildEventMessage(player, i));
    }
    return history;
  }

  private isPlayersTurn(player: number) {
    return player === (this.state.turn - 1) % this.variant.numPlayers;
  }

  private async broadcastLatestEvent() {
    let turn = this.state.turn - 1;
    this.connections.forEach((c) => {
      let message = this.buildEventMessage(c.player, turn);
      c.callback(message);
    });
  }

  public async attemptPlayerAction(player: number, action: GameAttempt) {
    //Check to make sure its this players turn
    if (!this.isPlayersTurn(player)) return false;
    //If build event from attempt
    const event = resolveGameAttempt(
      action,
      this.state,
      this.variant,
      this.shuffleOrder
    );
    //If event is valid...
    if (event !== undefined) {
      switch (event.type) {
        //If the event was a play or discard we need to reveal the played card, and the new card from the deck
        case GameEventType.Play:
        case GameEventType.Discard: {
          const card = event.card;
          this.revealCardToPlayer(card, player);
          this.revealCardToAllButOnePlayer(this.state.topDeck, player);
        }
        // falls through so any event gets propagated onto the state and announced to clients
        case GameEventType.Clue:
          this.state = reduceGameEvent(this.state, event, this.variant);
          this.events.push(event);
          this.broadcastLatestEvent();
          return true;
      }
    }
    //If event or event type wasn't valid, obviously it didn't work
    return false;
  }

  public async requestInitialState(player: number): Promise<GameData> {
    return {
      variant: this.variant,
      playerNames: this.playerNames,
      events: this.buildStateHistory(player),
    };
  }

  public async connect(connection: GameClientConnection) {
    this.connections.push(connection);
  }

  get connectedPlayers() {
    return this.connections.length;
  }
}