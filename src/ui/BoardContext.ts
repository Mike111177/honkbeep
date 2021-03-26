import React, { useCallback, useContext, useState } from "react";
import { useEffect } from "react";
import Board, { NullBoard } from "../client/Board";
import { BoardState } from "../client/states/BoardState";
import UserAction from "../client/types/UserAction";
import ArrayUtil from "../util/ArrayUtil";

export const BoardContext = React.createContext<Readonly<Board>>(
  new NullBoard()
);
export default BoardContext;

/**
 * Shorthand for useContext(BoardContext);
 * @returns Current board context
 */
export function useBoard() {
  return useContext(BoardContext);
}

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
        if (
          itemFn === undefined ||
          !ArrayUtil.shallowCompare(
            getRequestedItems(state) as any[],
            getRequestedItems(context.boardState) as any[]
          )
        ) {
          setState(context.boardState);
        }
      }),
    [context, getRequestedItems, itemFn, state]
  );
  return getRequestedItems(state);
}

export function useBoardReducer() {
  const context = useBoard();
  return useCallback((action: UserAction) => context.reduceUserAction(action), [
    context,
  ]);
}
