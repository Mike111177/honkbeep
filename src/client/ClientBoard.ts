import Backend from "../backend/types/Backend";
import { GameEventMessage } from "../backend/types/GameData";
import { GameAttempt } from "../game";
import Board from "./Board";
import BoardState, { appendEvent } from "./states/BoardState";

function appendEventMessage(
  state: BoardState,
  { event, reveals }: GameEventMessage
) {
  appendEvent(state, event);
  if (reveals) {
    for (let revealedCard of reveals) {
      state.shuffleOrder[revealedCard.deck] = revealedCard.card;
    }
  }
  return state;
}

export default class ClientBoard extends Board {
  //Adapter to use to communicate with server
  private backend: Backend;

  constructor(backend: Backend) {
    //Create new BoardState
    const state0 = backend
      .currentState()
      .events.reduce(
        (s, event) => appendEventMessage(s, event),
        new BoardState(backend.currentState().definition)
      );
    state0.viewOrder = backend.viewOrder;
    state0.perspective = backend.viewOrder;
    super(state0);
    //Listen for further game events
    backend.onChange(() => {
      const { events } = this.backend.currentState();
      this.updateBoardState((state) =>
        events
          .slice(state.latestTurn.turn)
          .reduce((s, event) => appendEventMessage(s, event), state)
      );
    });
    this.backend = backend;
  }

  async attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    return this.backend.attemptPlayerAction(action);
  }
}
