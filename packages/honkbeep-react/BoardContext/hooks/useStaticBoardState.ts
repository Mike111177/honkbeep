import { StaticBoardState } from "honkbeep-play/states/BoardState";
import { useBoard } from "./useBoard";

export function useStaticBoardState(): StaticBoardState {
  return useBoard().state;
}
