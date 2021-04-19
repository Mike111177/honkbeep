import { Immutable } from "../util/HelperTypes";
import { GameAttempt, GameEvent, resolveGameAttempt } from "../game";
import * as ArrayUtil from "../util/ArrayUtil";
import { BoardState, modifyBoardState } from "./states/BoardState";
import { UserAction, UserActionType } from "./types/UserAction";
import { reduceTurnEvent } from "./states/TurnState";
import { Draft } from "immer";

export type BoardUpdateListener = () => void;
export default abstract class Board {
  private listeners: BoardUpdateListener[];
  private _boardState?: Immutable<BoardState>;
  constructor(initialBoardState?: BoardState) {
    this._boardState = initialBoardState;
    this.listeners = [];
  }
  /**
   * `attemptPlayerAction` Triggers a user request to cause a game event
   * @param action action to attempt.
   * @returns promise that resolves to boolean indicating if action succeeds
   */
  protected abstract attemptPlayerAction(action: GameAttempt): Promise<boolean>;

  /**
   * Runs a given callback whenever the game state changes
   * @param callback callback to run
   * @returns function to unsubscribe
   */
  subscribeToStateChange(callback: BoardUpdateListener): () => void {
    const removeFunc = () => ArrayUtil.remove(this.listeners, callback);
    this.listeners.push(callback);
    return removeFunc;
  }

  protected updateBoardState(newState: Immutable<BoardState>) {
    this._boardState = newState;
    for (let f of this.listeners) f();
  }

  checkMoveValidity(move: GameAttempt) {
    return resolveGameAttempt(
      move,
      this.state.viewTurn,
      this.state.definition.variant,
      this.state.shuffleOrder
    );
  }

  get state(): Immutable<BoardState> {
    return this._boardState!;
  }

  reduceUserAction(action: UserAction) {
    switch (action.type) {
      case UserActionType.GameAttempt: {
        //If we are in a replay, or a hypothetical, we should NEVER use the default attempt player action method
        //Doing so could, for example send an unintentional play to the server when trying to look at a hypothetical
        if (!this.state.hypothetical && !this.state.paused) {
          return this.attemptPlayerAction(action.attempt);
        } else if (this.state.hypothetical) {
          //We may however want to try to simulate a hypothetical play, so we will try that here
          const move = this.checkMoveValidity(action.attempt);
          if (move !== undefined) {
            this.updateBoardState(
              modifyBoardState(this.state as BoardState, (state) => {
                const newHypotheticalTurn = reduceTurnEvent(
                  state.viewTurn,
                  move,
                  state.definition.variant
                );
                state.hypotheticalTurns.push(newHypotheticalTurn);
                state.hypotheticalEvents.push(move as Draft<GameEvent>);
              })
            );
            return true;
          } else {
            return false;
          }
        }
        //If there was no situation where a game action makes sense here, return false
        return false;
      }
      case UserActionType.SetViewTurn:
        return this.updateBoardState(
          modifyBoardState(this.state as BoardState, (state) => {
            state.paused = true;
            state.viewTurnNumber = Math.min(
              Math.max(action.turn, 1),
              state.turnHistory.length - 1
            );
          })
        );
      case UserActionType.Resume:
        return this.updateBoardState(
          modifyBoardState(this.state as BoardState, (state) => {
            state.paused = false;
            state.hypothetical = false;
            state.hypotheticalTurns.length = 0;
            state.hypotheticalEvents.length = 0;
            state.viewTurnNumber = state.latestTurn.turn;
          })
        );
      case UserActionType.StartHypothetical:
        return this.updateBoardState(
          modifyBoardState(this.state as BoardState, (state) => {
            state.paused = true;
            state.hypothetical = true;
          })
        );
      case UserActionType.EndHypothetical:
        return this.updateBoardState(
          modifyBoardState(this.state as BoardState, (state) => {
            state.hypothetical = false;
            state.hypotheticalTurns.length = 0;
            state.hypotheticalEvents.length = 0;
          })
        );
    }
  }
}

export class NullBoard extends Board {
  attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    throw new Error("Tried to use null board!");
  }
}
