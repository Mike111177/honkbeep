import React, { useCallback, useEffect, useState } from "react";
import EventEmitter from "events";

import BackendInterface from "../../game/BackendInterface";
import NullBackend from "../../game/NullBackend";
import { GameAttempt, GameData } from "../../game/GameTypes";
import {
  initTurnState,
  reduceTurnMessage,
  TurnState,
} from "./states/TurnState";
import { initNullGameState } from "../../game/states/GameState";

function reduceGameStateFromGameData(
  state: TurnState,
  data: GameData,
  max_turn: number = data.events.length
) {
  let messages = data.events;
  for (let i = state.game.turn; i < Math.min(messages.length, max_turn); i++) {
    state = reduceTurnMessage(state, messages[i]);
  }
  return state;
}

export default class ClientState extends EventEmitter {
  //Game State after Deal Event, blank until Deal event processed
  private initialTurn: TurnState;
  //Most recent canonical game state
  latestTurn: TurnState;
  //Game state currently being viewed, this could be the latest state, a replay state or a hypothetical state
  viewTurn: TurnState;
  //Adapter to use to communicate with server
  private backend: BackendInterface;

  paused: boolean = false;

  constructor(backend: BackendInterface) {
    super();
    //Many things will be listening to updates from this
    this.setMaxListeners(100);
    this.backend = backend;

    if (!(backend instanceof NullBackend)) {
      //Create new ClientState
      const state0 = initTurnState(this.backend.currentState().definition);

      //Set the initial state to the turn after the deal
      this.initialTurn = reduceGameStateFromGameData(
        state0,
        this.backend.currentState(),
        1
      );
      //Set the view state and latest state to be the most recent calculable from the Game Event data we have
      this.viewTurn = this.latestTurn = reduceGameStateFromGameData(
        this.initialTurn,
        this.backend.currentState()
      );
      //Listen for further game events
      this.backend.on("gameStateChanged", () => {
        this.latestTurn = reduceGameStateFromGameData(
          this.latestTurn!,
          this.backend.currentState()
        );
        if (!this.paused) {
          this.viewTurn = this.latestTurn;
        }
        this.emit("game-update");
      });
    } else {
      this.latestTurn = this.viewTurn = this.initialTurn = {
        shuffleOrder: [],
        empathy: [],
        game: initNullGameState(),
      };
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
   * `getStateOfTurn` returns the game state from any given turn number
   *
   * Try to avoid excessive calling of this, it has to recalculate the entire game state
   * making this a very expensive operation.
   *
   * @param {number} turn turn number
   */
  getStateOfTurn(turn: number) {
    return reduceGameStateFromGameData(
      this.initialTurn!,
      this.backend.currentState(),
      turn
    );
  }

  /**
   * Changes the currently viewed turn
   * @param {number} turn turn number
   */
  setViewTurn(turn: number) {
    this.viewTurn = this.getStateOfTurn(turn);
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
    this.paused = false;
    this.viewTurn = this.latestTurn;
    this.emit("game-update");
  }
  /**
   * Desynchronize viewstate with latest state
   */
  pause() {
    this.paused = true;
    this.emit("game-update");
  }

  //eslint thinks this is a class component so its angry about these hook,
  //but it is fine, because this is only usable from a context anyway
  /* eslint-disable react-hooks/rules-of-hooks */
  useLatestTurn(): TurnState {
    const [tState, setTState] = useState(this.latestTurn!);
    const updateCB = useCallback(() => setTState(this.latestTurn!), []);
    useEffect(() => this.subscribeToStateChange(updateCB), [updateCB]);
    return tState;
  }
  
  useViewTurn(): TurnState {
    const [tState, setTState] = useState(this.viewTurn!);
    const updateCB = useCallback(() => setTState(this.viewTurn!), []);
    useEffect(() => this.subscribeToStateChange(updateCB), [updateCB]);
    return tState;
  }
}

export const GameUIContext = React.createContext<Readonly<ClientState>>(
  new ClientState(new NullBackend())
);
