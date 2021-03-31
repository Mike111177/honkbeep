import { Deck } from "../../game/DeckBuilding";
import {
  GameDefinition,
  GameEvent,
  GameEventMessage,
} from "../../game/GameTypes";
import { Mutable } from "../../util/HelperTypes";
import { initTurnState, reduceTurnEvent, TurnState } from "./TurnState";

export class BoardState {
  //Deck info
  readonly deck: Deck;
  //info to define game
  readonly definition: GameDefinition;
  //Historic turns
  readonly turnHistory: ReadonlyArray<TurnState>;
  //Most hypothetical turns
  readonly hypotheticalTurns: ReadonlyArray<TurnState>;
  //Turn state currently being viewed
  readonly viewTurnNumber: number;
  //Whether or not the viewTurn is synchronized with the latestTurn
  readonly paused: boolean;
  //Whether or not we are viewing a hypothetical
  readonly hypothetical: boolean;
  //Known shuffle order
  readonly shuffleOrder: ReadonlyArray<number>;
  //Event History
  readonly events: ReadonlyArray<GameEvent>;
  //Player of current perspective, -1 to follow viewTurn, undefined for spectator
  //This only effects card visibility
  readonly perspective: number | undefined;
  //Which players hand should be displayed on top, -1 to follow viewTurn
  //This only effects the order of hands
  readonly playerView: number;

  constructor(definition?: GameDefinition) {
    this.definition = definition ?? {
      playerNames: [],
      variant: { handSize: 0, numPlayers: 0, suits: [] },
    };
    this.deck = new Deck(definition?.variant);
    this.turnHistory =
      definition !== undefined ? [initTurnState(definition, this.deck)] : [];
    this.viewTurnNumber = 1;
    this.paused = false;
    this.shuffleOrder = [];
    this.events = [];
    this.perspective = undefined;
    this.playerView = 0;
    this.hypotheticalTurns = [];
    this.hypothetical = false;
  }

  get latestTurn() {
    if (this.hypothetical) {
      return this.hypotheticalTurns[this.hypotheticalTurns.length - 1];
    } else {
      return this.turnHistory[this.turnHistory.length - 1];
    }
  }

  get viewTurn() {
    if (this.hypothetical) {
      return this.hypotheticalTurns[this.hypotheticalTurns.length - 1];
    } else {
      return this.turnHistory[this.viewTurnNumber];
    }
  }

  appendEvent(event: GameEvent) {
    //Push event into history
    (this.events as Mutable<BoardState["events"]>).push(event);
    (this.turnHistory as Mutable<BoardState["turnHistory"]>).push(
      reduceTurnEvent(this.latestTurn, event, this.deck, this.definition)
    );
    //If the viewTurn is not paused (as in we are not in replay or hypothetical mode), have the viewTurn follow the latestTurn
    if (!this.paused) {
      (this as Mutable<BoardState>).viewTurnNumber = this.latestTurn.turn;
    }
  }

  appendEventMessage({ event, reveals }: GameEventMessage) {
    this.appendEvent(event);
    if (reveals) {
      for (let revealedCard of reveals) {
        (this.shuffleOrder as Mutable<BoardState["shuffleOrder"]>)[
          revealedCard.deck
        ] = revealedCard.card;
      }
    }
    return this;
  }

  jumpToTurn(turn: number) {
    (this.paused as Mutable<BoardState["paused"]>) = true;
    (this as Mutable<BoardState>).viewTurnNumber = Math.min(
      Math.max(turn, 1),
      this.turnHistory.length - 1
    );
    return this;
  }

  resume() {
    (this as Mutable<BoardState>).paused = false;
    (this as Mutable<BoardState>).viewTurnNumber = this.latestTurn.turn;
    return this;
  }

  setShuffleOrder(order: number[]) {
    (this as Mutable<BoardState>).shuffleOrder = order;
    return this;
  }

  setPerspective(player?: number) {
    (this as Mutable<BoardState>).perspective = player;
    return this;
  }
}
