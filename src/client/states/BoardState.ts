import produce, { immerable, Draft, Immutable } from "immer";
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
  readonly hypotheticalEvents: ReadonlyArray<GameEvent>;
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
  readonly viewOrder: number;

  constructor(definition: GameDefinition) {
    this.definition = definition;
    this.turnHistory = [initTurnState(definition.variant)];
    this.viewTurnNumber = 0;
    this.paused = false;
    this.shuffleOrder = [];
    this.events = [];
    this.perspective = undefined;
    this.viewOrder = 0;
    this.hypotheticalTurns = [];
    this.hypotheticalEvents = [];
    this.hypothetical = false;
  }

  get latestTurn() {
    return this.turnHistory[this.turnHistory.length - 1];
  }

  get viewTurn() {
    if (this.hypothetical && this.hypotheticalTurns.length > 0) {
      return this.hypotheticalTurns[this.hypotheticalTurns.length - 1];
    } else {
      return this.turnHistory[this.viewTurnNumber];
    }
  }

  getTurn(num: number) {
    if (this.hypothetical && num >= this.viewTurnNumber) {
      return this.hypotheticalTurns[num - this.viewTurnNumber];
    } else {
      return this.turnHistory[num];
    }
  }

  getEvent(num: number) {
    if (this.hypothetical && num >= this.viewTurnNumber) {
      return this.hypotheticalEvents[num - this.viewTurnNumber];
    } else {
      return this.events[num];
    }
  }

  appendEvent(event: GameEvent) {
    return appendEventProd(this, event);
  }

  appendEventMessage(msg: GameEventMessage) {
    return appendEventMessageProd(this, msg);
  }

  setShuffleOrder(order: number[]) {
    return setShuffleOrderProd(this, order);
  }

  setPerspective(player?: number) {
    return setPerspectiveProd(this, player);
  }

  setViewOrder(viewOrder: number) {
    return setViewOrderProd(this, viewOrder);
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

const setViewOrderProd = produce(
  (state: Draft<BoardState>, viewOrder: number) => {
    state.viewOrder = viewOrder;
  }
);

//I think this is roughly the programming model im going to switch to for the rest of BoardState mutations
export function modifyBoardState(
  state: Immutable<BoardState>,
  fn: (s: Draft<Immutable<BoardState>>) => void
) {
  return produce(state, fn);
}
