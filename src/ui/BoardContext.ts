import { Immutable } from "../util/HelperTypes";
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

type IMBoardState = Immutable<BoardState>;
type StateExtractor<T> = (e: IMBoardState) => T;
export function useBoardState(): IMBoardState;
export function useBoardState<T extends any[]>(extractFn: StateExtractor<T>): T;
export function useBoardState<T extends any[]>(extractFn?: StateExtractor<T>) {
  const context = useContext(BoardContext);
  const [state, setState] = useState(context.boardState);
  useEffect(
    () =>
      context.subscribeToStateChange(() => {
        if (
          extractFn === undefined ||
          !ArrayUtil.shallowCompare(
            extractFn(state),
            extractFn(context.boardState)
          )
        ) {
          setState(context.boardState);
        }
      }),
    [context, extractFn, state]
  );
  return extractFn ? extractFn(state) : state;
}

export function useBoardReducer() {
  const context = useBoard();
  return useCallback((action: UserAction) => context.reduceUserAction(action), [
    context,
  ]);
}
