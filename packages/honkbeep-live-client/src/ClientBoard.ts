import Backend from "honkbeep-protocol/types/Backend";
import { GameEventMessage } from "honkbeep-protocol/types/GameData";
import { GameAttempt } from "honkbeep-game";

import { Board, appendEvent, BoardState } from "honkbeep-play";

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
    const data = backend.currentData();
    const state0 = data.events.reduce(
      (s, event) => appendEventMessage(s, event),
      new BoardState(data.variant, data.playerNames)
    );
    state0.viewOrder = backend.viewOrder;
    state0.perspective = backend.viewOrder;
    super(state0);
    //Listen for further game events
    backend.onChange(() => {
      const { events } = this.backend.currentData();
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
