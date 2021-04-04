import produce, { immerable, Draft } from "immer";
import { GameEventMessage } from "../../backend/types/GameData";
import { GameDefinition, GameEvent } from "../../game";
import { TurnState, initTurnState, reduceTurnEvent } from "./TurnState";

export class BoardState {
  readonly [immerable] = true;
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

  constructor(definition: GameDefinition) {
    this.definition = definition;
    this.turnHistory = [initTurnState(definition.variant)];
    this.viewTurnNumber = 0;
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
    return appendEventProd(this, event);
  }

  appendEventMessage(msg: GameEventMessage) {
    return appendEventMessageProd(this, msg);
  }

  jumpToTurn(turn: number) {
    return jumpToTurnProd(this, turn);
  }

  resume() {
    return resumeProd(this);
  }

  setShuffleOrder(order: number[]) {
    return setShuffleOrderProd(this, order);
  }

  setPerspective(player?: number) {
    return setPerspectiveProd(this, player);
  }
}
export default BoardState;

function appendEventFn(state: Draft<BoardState>, event: GameEvent) {
  //Push event into history
  state.events.push(event as Draft<GameEvent>);
  state.turnHistory.push(
    reduceTurnEvent(state.latestTurn, event, state.definition.variant)
  );
  //If the viewTurn is not paused (as in we are not in replay or hypothetical mode), have the viewTurn follow the latestTurn
  if (!state.paused) {
    state.viewTurnNumber = state.latestTurn.turn;
  }
}

const appendEventProd = produce(appendEventFn);

const appendEventMessageProd = produce(
  (state: Draft<BoardState>, { event, reveals }: GameEventMessage) => {
    appendEventFn(state, event);
    if (reveals) {
      for (let revealedCard of reveals) {
        state.shuffleOrder[revealedCard.deck] = revealedCard.card;
      }
    }
  }
);

const jumpToTurnProd = produce((state: Draft<BoardState>, turn: number) => {
  state.paused = true;
  state.viewTurnNumber = Math.min(
    Math.max(turn, 1),
    state.turnHistory.length - 1
  );
});

const resumeProd = produce((state: Draft<BoardState>) => {
  state.paused = false;
  state.viewTurnNumber = state.latestTurn.turn;
});

const setShuffleOrderProd = produce(
  (state: Draft<BoardState>, order: number[]) => {
    state.shuffleOrder = order;
  }
);

const setPerspectiveProd = produce(
  (state: Draft<BoardState>, player?: number) => {
    state.perspective = player;
  }
);
