import produce, { Draft } from "immer";
import {
  GameDefinition,
  GameEvent,
  GameEventMessage,
} from "../../../game/GameTypes";
import { initNullGameState } from "../../../game/states/GameState";
import { initTurnState, reduceTurnEvent, TurnState } from "./TurnState";

export type BoardState = {
  //Game State after Deal Event, blank until Deal event processed
  readonly initialTurn: TurnState;
  //Most recent canonical game state
  readonly latestTurn: TurnState;
  //Game state currently being viewed, this could be the latest state, a replay state or a hypothetical state
  readonly viewTurn: TurnState;
  //Whether or not the viewTurn is synchronized with the latestTurn
  readonly paused: boolean;
  //Known shuffle order
  readonly shuffleOrder: ReadonlyArray<number>;
  //Event History
  readonly events: ReadonlyArray<GameEvent>;
};

function reduceBoardMessageFn(
  state: Draft<BoardState>,
  { event, reveals }: GameEventMessage
) {
  //Push event into history
  state.events.push(event);
  //Advance latest turn
  state.latestTurn = reduceTurnEvent(state.latestTurn, event);
  //If this was the first turn, lets bump the initial state by 1 so we dont have to recalc the deal
  if (state.initialTurn.game.turn === 0) {
    state.initialTurn = state.latestTurn;
  }
  //If the viewTurn is not paused (as in we are not in replay or hypothetical mode), have the viewTurn follow the latestTurn
  if (!state.paused) {
    state.viewTurn = state.latestTurn;
  }
  //Process Reveals
  if (reveals) {
    for (let revealedCard of reveals) {
      state.shuffleOrder[revealedCard.deck] = revealedCard.card;
    }
  }
}
export const reduceBoardMessage = produce(reduceBoardMessageFn);

function reduceBoardTurnJumpFn(state: Draft<BoardState>, turn: number) {
  state.paused = true;
  //If we are already on this turn, lets not recalculate everything before it
  if (turn !== state.viewTurn.game.turn) {
    let temp = state.initialTurn;
    for (let i = 1; i < turn && i < state.latestTurn.game.turn; i++) {
      temp = reduceTurnEvent(temp, state.events[i]);
    }
    state.viewTurn = temp;
  }
}
export const reduceBoardTurnJump = produce(reduceBoardTurnJumpFn);

export const reduceBoardUnpause = produce((state: Draft<BoardState>) => {
  state.paused = false;
  state.viewTurn = state.latestTurn;
});

export function initBoardState(definition: GameDefinition): BoardState {
  const state0 = initTurnState(definition);
  return {
    initialTurn: state0,
    latestTurn: state0,
    viewTurn: state0,
    paused: false,
    shuffleOrder: [],
    events: [],
  };
}

export function initNullBoardState(): BoardState {
  const state0 = {
    shuffleOrder: [],
    empathy: [],
    game: initNullGameState(),
  };
  return {
    initialTurn: state0,
    latestTurn: state0,
    viewTurn: state0,
    paused: false,
    shuffleOrder: [],
    events: [],
  };
}
