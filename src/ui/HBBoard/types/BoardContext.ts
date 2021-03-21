import React, { useCallback, useContext, useState } from "react";
import { useEffect } from "react";
import { GameAttempt } from "../../../game/GameTypes";
import ArrayUtil from "../../../util/ArrayUtil";
import { PickMutable } from "../../../util/HelperTypes";
import {
  BoardState,
  initNullBoardState,
  reduceBoardTurnJump,
  reduceBoardUnpause,
} from "../states/BoardState";

type BoardUpdateListener = () => void;
export abstract class Board {
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
  abstract attemptPlayerAction(action: GameAttempt): Promise<boolean>;

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

  updateBoardState(newBoardState: BoardState) {
    (this as PickMutable<Board, "boardState">).boardState = newBoardState;
    for (let f of this.listeners) f();
  }

  /**
   * Changes the currently viewed turn
   * @param {number} turn turn number
   */
  setViewTurn(turn: number): void {
    this.updateBoardState(reduceBoardTurnJump(this.boardState, turn));
  }

  /**
   * Synchronize viewstate with latest state
   */
  unpause() {
    this.updateBoardState(reduceBoardUnpause(this.boardState));
  }

  /**
   * Desynchronize viewstate with latest state
   */
  pause() {
    this.updateBoardState(
      reduceBoardTurnJump(this.boardState, this.boardState.viewTurn.turn)
    );
  }
}

class NullBoard extends Board {
  attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    throw new Error("Tried to use null board!");
  }
  constructor() {
    super(initNullBoardState());
  }
}

export const BoardContext = React.createContext<Readonly<Board>>(
  new NullBoard()
);

export function useBoardState(): Readonly<BoardState>;
export function useBoardState<T extends any[]>(
  itemFn: (e: Readonly<BoardState>) => T
): T;
export function useBoardState<T extends any[]>(
  itemFn?: (e: Readonly<BoardState>) => T
) {
  const context = useContext(BoardContext);
  const [state, setState] = useState(context.boardState);
  const getRequestedItems = useCallback(
    (s: Readonly<BoardState>) => {
      if (itemFn === undefined) {
        return s;
      } else {
        return itemFn(s);
      }
    },
    [itemFn]
  );
  useEffect(
    () =>
      context.subscribeToStateChange(() => {
        if (itemFn === undefined) {
          setState(context.boardState);
        } else {
          const prevItems = getRequestedItems(state) as any[];
          const nextItems = getRequestedItems(context.boardState) as any[];
          if (prevItems.length === nextItems.length) {
            for (let i = 0; i < prevItems.length; i++) {
              if (prevItems[i] !== nextItems[i]) {
                setState(context.boardState);
                return;
              }
            }
          } else {
            setState(context.boardState);
          }
        }
      }),
    [context, getRequestedItems, itemFn, state]
  );
  return getRequestedItems(state);
}
