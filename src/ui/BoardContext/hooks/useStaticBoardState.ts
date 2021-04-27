import { StaticBoardState } from "../../../client/states/BoardState";
import { useBoard } from "./useBoard";

export function useStaticBoardState(): StaticBoardState {
  return useBoard().state;
}
