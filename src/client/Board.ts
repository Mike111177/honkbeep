import { GameAttempt } from "../game/GameTypes";
import ArrayUtil from "../util/ArrayUtil";
import { BoardState } from "./states/BoardState";
import { UserAction, UserActionType } from "./types/UserAction";

export type BoardUpdateListener = () => void;
export default abstract class Board {
  private listeners: BoardUpdateListener[];
  readonly boardState: BoardState;
  constructor(initialBoardState: BoardState) {
    this.boardState = initialBoardState;
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

  updateBoardState(a?: any) {
    for (let f of this.listeners) f();
  }

  reduceUserAction(action: UserAction) {
    switch (action.type) {
      case UserActionType.GameAttempt:
        return this.attemptPlayerAction(action.attempt);
      case UserActionType.SetViewTurn:
        return this.updateBoardState(this.boardState.jumpToTurn(action.turn));
      case UserActionType.Resume:
        return this.updateBoardState(this.boardState.resume());
    }
  }
}

export class NullBoard extends Board {
  constructor() {
    super(new BoardState());
  }
  attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    throw new Error("Tried to use null board!");
  }
}
