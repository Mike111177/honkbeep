import BackendInterface from "../game/BackendInterface";
import { GameAttempt, GameData } from "../game/GameTypes";
import NullBackend from "../game/NullBackend";
import Board from "./Board";
import {
  BoardState,
  initBoardState,
  initNullBoardState,
  reduceBoardMessage,
} from "./states/BoardState";

function reduceGameStateFromGameData(
  state: BoardState,
  data: GameData,
  max_turn: number = data.events.length
) {
  let messages = data.events;
  const firstTurn = state.latestTurn.turn;
  for (let i = firstTurn; i < Math.min(messages.length, max_turn); i++) {
    state = reduceBoardMessage(state, messages[i]);
  }
  return state;
}

export default class ClientBoard extends Board {
  //Adapter to use to communicate with server
  private backend: BackendInterface;

  constructor(backend: BackendInterface) {
    if (!(backend instanceof NullBackend)) {
      //Create new ClientState
      super(
        reduceGameStateFromGameData(
          initBoardState(backend.currentState().definition),
          backend.currentState()
        )
      );
      //Listen for further game events
      backend.on("gameStateChanged", () => {
        this.updateBoardState(
          reduceGameStateFromGameData(
            this.boardState,
            this.backend.currentState()
          )
        );
      });
    } else {
      super(initNullBoardState());
    }
    this.backend = backend;
  }

  async attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    return this.backend.attemptPlayerAction(action);
  }
}
