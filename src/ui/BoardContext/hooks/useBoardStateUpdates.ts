import { DependencyList, useEffect } from "react";
import { BoardStateUser } from "../Types";
import { useBoard } from "./useBoard";

export function useBoardStateUpdates(
  callback: BoardStateUser<void>,
  dependencies: DependencyList = []
) {
  //Get our board context
  const context = useBoard();
  useEffect(
    () => context.subscribeToStateChange(() => callback(context.state)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, ...dependencies]
  );
}
