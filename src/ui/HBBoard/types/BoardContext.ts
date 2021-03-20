import EventEmitter from "events";
import React, { useCallback, useContext, useState } from "react";
import { useEffect } from "react";
import { GameAttempt } from "../../../game/GameTypes";
import {
  BoardState,
  initNullBoardState,
  reduceBoardTurnJump,
  reduceBoardUnpause,
} from "../states/BoardState";

export abstract class Board extends EventEmitter {
  boardState: BoardState;
  constructor(initialBoardState: BoardState) {
    super();
    this.setMaxListeners(200);
    this.boardState = initialBoardState;
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
  subscribeToStateChange(callback: () => void): () => void {
    const removeFunc = () => {
      this.off("game-update", callback);
    };
    this.on("game-update", callback);
    return removeFunc;
  }

  /**
   * Changes the currently viewed turn
   * @param {number} turn turn number
   */
  setViewTurn(turn: number): void {
    this.boardState = reduceBoardTurnJump(this.boardState, turn);
    this.emit("game-update");
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
      this.boardState.viewTurn.turn
    );
    this.emit("game-update");
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
