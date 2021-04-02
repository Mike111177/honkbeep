import BackendInterface from "../game/BackendInterface";
import { GameAttempt } from "../game/types/GameEvent";
import NullBackend from "../game/NullBackend";
import Board from "./Board";
import { BoardState } from "./states/BoardState";

export default class ClientBoard extends Board {
  //Adapter to use to communicate with server
  private backend: BackendInterface;

  constructor(backend: BackendInterface) {
    if (!(backend instanceof NullBackend)) {
      //Create new ClientState
      super(
        backend
          .currentState()
          .events.reduce(
            (s, event) => s.appendEventMessage(event),
            new BoardState(backend.currentState().definition)
          )
      );
      //Listen for further game events
      backend.on("gameStateChanged", () => {
        const { events } = this.backend.currentState();
        this.updateBoardState(
          events
            .slice(this.boardState.latestTurn.turn)
            .reduce((s, event) => s.appendEventMessage(event), this.boardState)
        );
      });
    } else {
      super();
    }
    this.backend = backend;
  }

  async attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    return this.backend.attemptPlayerAction(action);
  }
}
