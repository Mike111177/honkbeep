import { Immutable } from "../util/HelperTypes";
import React, { useCallback, useContext, useState } from "react";
import { useEffect } from "react";
import Board, { NullBoard } from "../client/Board";
import { BoardState } from "../client/states/BoardState";
import UserAction from "../client/types/UserAction";

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

type BoardStateUser<T> = (newState: Immutable<BoardState>) => T;
type BoardStateComparator<T> = (a: T, b: T) => boolean;
export function useBoardState<T>(
  fn: BoardStateUser<T>,
  cmp: BoardStateComparator<T> = Object.is
) {
  const context = useContext(BoardContext);
  const [state, setState] = useState(() => fn(context.state));
  useEffect(
    () =>
      context.subscribeToStateChange(() => {
        const nextState = fn(context.state);
        if (!cmp(state, nextState)) {
          setState(nextState);
        }
      }),
    [context, state, cmp, fn]
  );
  return state;
}

export function useBoardReducer() {
  const context = useBoard();
  return useCallback((action: UserAction) => context.reduceUserAction(action), [
    context,
  ]);
}
