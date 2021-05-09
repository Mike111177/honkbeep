import { useCallback, useState, DependencyList } from "react";
import { BoardStateUser, BoardStateComparator } from "../Types";
import { useBoard } from "./useBoard";
import { useBoardStateUpdates } from "./useBoardStateUpdates";

/**
 * useBoardReducer takes a transform function, and returns the result of applying that
 * function to the current board state. It will also update the return value
 * whenever the board state changes in a way that causes the result of the
 * supplied transform to change, causing a rerender of your component.
 *
 * @param transform function to extract desired data from board state
 * @param dependencies dependencies for supplied transform function
 * @param comparator custom comparator function check if previous result is equivalent to new result
 * @returns The result of applying supplied function on the current board state
 */
export function useBoardStateSelector<T>(
  transform: BoardStateUser<T>,
  dependencies: DependencyList = [],
  comparator: BoardStateComparator<T> = Object.is
) {
  //Get our board context
  const context = useBoard();

  // The user should provide their own dependencies for their callback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const transformCallback = useCallback(transform, dependencies);

  //The state will always be the result of applying the users user function to the current board state
  const [state, setState] = useState(() => transformCallback(context.state));

  //Subscribe to board state updates
  useBoardStateUpdates(
    (next) => {
      //Get the next state
      const nextState = transformCallback(next);
      //Check if the state is different than the previous
      if (!comparator(state, nextState)) {
        //If it is different call setState likely triggering a rerender of the component
        setState(nextState);
      }
    },
    [state, comparator, transformCallback]
  );

  return state;
}
