import { useEffect, useState } from "react";
import BackendInterface from "../../game/BackendInterface";
import { GameData, GameAttempt } from "../../game/GameTypes";
import NullBackend from "../../game/NullBackend";
import {
  BoardState,
  reduceBoardMessage,
  initBoardState,
  initNullBoardState,
} from "./states/BoardState";
import { Board } from "./types/BoardContext";
import HBBoardLayout from "./HBBoardLayout";
import LocalServer from "../../game/LocalServer";
import LocalBackend from "../../game/LocalBackend";

function reduceGameStateFromGameData(
  state: BoardState,
  data: GameData,
  max_turn: number = data.events.length
) {
  let messages = data.events;
  const firstTurn = state.latestTurn.game.turn;
  for (let i = firstTurn; i < Math.min(messages.length, max_turn); i++) {
    state = reduceBoardMessage(state, messages[i]);
  }
  return state;
}
class ClientBoard extends Board {
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
        this.boardState = reduceGameStateFromGameData(
          this.boardState,
          this.backend.currentState()
        );
        this.emit("game-update");
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

export default function HBBoard() {
  const gamedef = {
    variant: {
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 4,
    },
    playerNames: ["Alice", "Bob", "Cathy", "Donald"],
  };

  //Create virtual local Server
  const [server] = useState(() => new LocalServer(gamedef));
  //Connect to local server as player 0
  const [backend] = useState(() => new LocalBackend(0, server));

  const [manager, setManager] = useState<undefined | ClientBoard>(undefined);

  useEffect(() => {
    backend.onReady(() => setManager(new ClientBoard(backend)));
  }, [backend]);

  if (manager !== undefined) {
    return <HBBoardLayout board={manager} />;
  } else {
    return <span>Waiting for initialization.</span>;
  }
}
