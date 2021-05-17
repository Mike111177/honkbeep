import { useCallback } from "react";
import { UserAction } from "honkbeep-play";
import { useBoard } from "./useBoard";

export function useBoardReducer() {
  const context = useBoard();
  return useCallback(
    (action: UserAction) => context.reduceUserAction(action),
    [context]
  );
}
