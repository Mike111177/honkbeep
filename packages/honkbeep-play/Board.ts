import { Immutable } from "honkbeep-util/HelperTypes";
import { GameAttempt, GameEvent, resolveGameAttempt } from "honkbeep-game";
import * as ArrayUtil from "honkbeep-util/ArrayUtil";
import {
  BoardState,
  BoardStateMutator,
  ImmutableBoardState,
  mutateBoardState,
} from "./states/BoardState";
import { UserAction, UserActionType } from "./types/UserAction";
import { reduceTurnEvent } from "./reducers/TurnStateReducers";
import { Draft } from "immer";

export type BoardUpdateListener = () => void;

export default abstract class Board {
  private listeners: BoardUpdateListener[];
  private readonly _boardState?: ImmutableBoardState;
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

  protected updateBoardState(fn: BoardStateMutator) {
    mutateBoardState(this._boardState!, fn);
    for (let f of this.listeners) f();
  }

  checkMoveValidity(move: GameAttempt) {
    return resolveGameAttempt(
      move,
      this.state.viewTurn,
      this.state.variant,
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
            this.updateBoardState((state) => {
              const newHypotheticalTurn = reduceTurnEvent(
                state.viewTurn,
                move,
                state.variant
              );
              state.hypotheticalTurns.push(newHypotheticalTurn);
              state.hypotheticalEvents.push(move as Draft<GameEvent>);
            });
            return true;
          } else {
            return false;
          }
        }
        //If there was no situation where a game action makes sense here, return false
        return false;
      }
      case UserActionType.SetViewTurn:
        return this.updateBoardState((state) => {
          state.paused = true;
          state.turnIndex = Math.min(
            Math.max(action.turn, 1),
            state.turns.length - 1
          );
        });
      case UserActionType.Resume:
        return this.updateBoardState((state) => {
          state.paused = false;
          state.hypothetical = false;
          state.hypotheticalTurns.length = 0;
          state.hypotheticalEvents.length = 0;
          state.turnIndex = state.latestTurn.turn;
        });
      case UserActionType.StartHypothetical:
        return this.updateBoardState((state) => {
          state.paused = true;
          state.hypothetical = true;
        });
      case UserActionType.EndHypothetical:
        return this.updateBoardState((state) => {
          state.hypothetical = false;
          state.hypotheticalTurns.length = 0;
          state.hypotheticalEvents.length = 0;
        });
      case UserActionType.EditNote:
        return this.updateBoardState((state) => {
          state.cardNotes[action.card] = action.content;
        });
    }
  }
}
