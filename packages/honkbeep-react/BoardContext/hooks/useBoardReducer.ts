import { useCallback } from "react";
import UserAction from "../../../client/types/UserAction";
import { useBoard } from "./useBoard";

export function useBoardReducer() {
  const context = useBoard();
  return useCallback((action: UserAction) => context.reduceUserAction(action), [
    context,
  ]);
}
