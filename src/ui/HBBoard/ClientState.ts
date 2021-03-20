import React, { useCallback, useEffect, useState } from "react";
import EventEmitter from "events";

import BackendInterface from "../../game/BackendInterface";
import NullBackend from "../../game/NullBackend";
import { GameAttempt, GameData } from "../../game/GameTypes";
import {
  BoardState,
  initBoardState,
  initNullBoardState,
  reduceBoardMessage,
  reduceBoardTurnJump,
  reduceBoardUnpause,
} from "./states/BoardState";
import { TurnState } from "./states/TurnState";

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

export default class ClientState extends EventEmitter {
  //Adapter to use to communicate with server
  private backend: BackendInterface;
  boardState: BoardState;

  constructor(backend: BackendInterface) {
    super();
    //Many things will be listening to updates from this
    //TODO: the event listeners are getting out of control, the dispatch needs to be smarter for perf
    this.setMaxListeners(200);
    this.backend = backend;

    if (!(backend instanceof NullBackend)) {
      //Create new ClientState
      this.boardState = reduceGameStateFromGameData(
        initBoardState(this.backend.currentState().definition),
        this.backend.currentState()
      );

      //Listen for further game events
      this.backend.on("gameStateChanged", () => {
        this.boardState = reduceGameStateFromGameData(
          this.boardState,
          this.backend.currentState()
        );
        this.emit("game-update");
      });
    } else {
      this.boardState = initNullBoardState();
    }
  }

  /**
   * `attemptPlayerAction` Triggers a user request to cause a game event
   * @param action action to attempt.
   * @returns {Promise<boolean>} promise that resolves to boolean indicating if action succeeds
   */
  async attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    return this.backend.attemptPlayerAction(action);
  }

  /**
   * `getMessage` returns a message from the server that triggered a turn or GameEvent
   * @param {number} index turn index of message
   */
  getMessage(index: number) {
    return this.backend.currentState().events[index];
  }

  /**
   * Changes the currently viewed turn
   * @param {number} turn turn number
   */
  setViewTurn(turn: number) {
    this.boardState = reduceBoardTurnJump(this.boardState, turn);
    this.emit("game-update");
  }

  /**
   * Runs a given callback whenever the game state changes
   * @param callback callback to run
   * @returns function to unsubscribe
   */
  subscribeToStateChange(callback: () => void) {
    const removeFunc = () => {
      this.off("game-update", callback);
    };
    this.on("game-update", callback);
    return removeFunc;
  }

  /**
   * Synchronize viewstate with latest state
   */
  unpause() {
    this.boardState = reduceBoardUnpause(this.boardState);
    this.emit("game-update");
  }
  /**
   * Desynchronize viewstate with latest state
   */
  pause() {
    this.boardState = reduceBoardTurnJump(
      this.boardState,
      this.boardState.viewTurn.game.turn
    );
    this.emit("game-update");
  }

  //eslint thinks this is a class component so its angry about these hook,
  //but it is fine, because this is only usable from a context anyway
  /* eslint-disable react-hooks/rules-of-hooks */
  useLatestTurn(): TurnState {
    const [tState, setTState] = useState(this.boardState.latestTurn);
    const updateCB = useCallback(
      () => setTState(this.boardState.latestTurn),
      []
    );
    useEffect(() => this.subscribeToStateChange(updateCB), [updateCB]);
    return tState;
  }

  useViewTurn(): TurnState {
    const [tState, setTState] = useState(this.boardState.viewTurn!);
    const updateCB = useCallback(() => setTState(this.boardState.viewTurn), []);
    useEffect(() => this.subscribeToStateChange(updateCB), [updateCB]);
    return tState;
  }
}

export const GameUIContext = React.createContext<Readonly<ClientState>>(
  new ClientState(new NullBackend())
);
