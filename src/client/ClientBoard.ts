import Backend from "../backend/types/Backend";
import { GameAttempt } from "../game";
import Board from "./Board";
import BoardState from "./states/BoardState";

export default class ClientBoard extends Board {
  //Adapter to use to communicate with server
  private backend: Backend;

  //TODO: viewOrder should probably somehow be controlled by the backend
  constructor(backend: Backend) {
    //Create new ClientState
    super(
      backend
        .currentState()
        .events.reduce(
          (s, event) => s.appendEventMessage(event),
          new BoardState(backend.currentState().definition).setViewOrder(
            backend.viewOrder
          )
        )
    );
    //Listen for further game events
    backend.onChange(() => {
      const { events } = this.backend.currentState();
      this.updateBoardState(
        events
          .slice(this.state.latestTurn.turn)
          .reduce((s, event) => s.appendEventMessage(event), this.state)
      );
    });
    this.backend = backend;
  }

  async attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    return this.backend.attemptPlayerAction(action);
  }
}
