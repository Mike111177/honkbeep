import produce, { Draft } from "immer";
import { Deck } from "../../game/DeckBuilding";
import {
  GameDefinition,
  GameEvent,
  GameEventMessage,
} from "../../game/GameTypes";
import { initNullGameState } from "../../game/states/GameState";
import { initTurnState, reduceTurnEvent, TurnState } from "./TurnState";

export type BoardState = {
  //Deck info
  readonly deck: Deck;
  //info to define game
  readonly definition: GameDefinition;
  //Historic turns
  readonly turnHistory: TurnState[];
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
  //Player of current perspective, -1 to follow viewTurn, undefined for spectator
  //This only effects card visibility
  readonly perspective: number | undefined;
  //Which players hand should be displayed on top, -1 to follow viewTurn
  //This only effects the order of hands
  readonly playerView: number;
};

function reduceBoardEventFn(state: Draft<BoardState>, event: GameEvent) {
  //Push event into history
  state.events.push(event);
  //Advance latest turn
  state.latestTurn = reduceTurnEvent(
    state.latestTurn,
    event,
    state.deck,
    state.definition
  );
  //If this was the first turn, lets bump the initial state by 1 so we dont have to recalc the deal
  state.turnHistory.push(state.latestTurn);
  //If the viewTurn is not paused (as in we are not in replay or hypothetical mode), have the viewTurn follow the latestTurn
  if (!state.paused) {
    state.viewTurn = state.latestTurn;
  }
}
export const reduceBoardEvent = produce(reduceBoardEventFn);

function reduceBoardMessageFn(
  state: Draft<BoardState>,
  { event, reveals }: GameEventMessage
) {
  //Reduce Event
  reduceBoardEventFn(state, event);

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
  state.viewTurn =
    state.turnHistory[
      Math.min(Math.max(turn, 1), state.turnHistory.length - 1)
    ];
}
export const reduceBoardTurnJump = produce(reduceBoardTurnJumpFn);

export const reduceBoardUnpause = produce((state: Draft<BoardState>) => {
  state.paused = false;
  state.viewTurn = state.latestTurn;
});

export const reduceBoardSetShuffle = produce(
  (state: Draft<BoardState>, order: number[]) => {
    state.shuffleOrder = order;
  }
);

export const reduceBoardSetPerspective = produce(
  (state: Draft<BoardState>, player: number | undefined) => {
    state.perspective = player;
  }
);

export function initBoardState(definition: GameDefinition): BoardState {
  const deck = new Deck(definition.variant);
  const state0: TurnState = initTurnState(definition, deck);
  return {
    deck,
    definition,
    turnHistory: [state0],
    latestTurn: state0,
    viewTurn: state0,
    paused: false,
    shuffleOrder: [],
    events: [],
    perspective: undefined,
    playerView: 0,
  };
}

export function initNullBoardState(): BoardState {
  const state0: TurnState = {
    empathy: [],
    cardMeta: [],
    ...initNullGameState(),
  };
  return {
    deck: new Deck(),
    definition: {
      playerNames: [],
      variant: { handSize: 0, numPlayers: 0, suits: [] },
    },
    turnHistory: [state0],
    latestTurn: state0,
    viewTurn: state0,
    paused: false,
    shuffleOrder: [],
    events: [],
    perspective: undefined,
    playerView: 0,
  };
}
