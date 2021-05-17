import { StaticBoardState } from "honkbeep-play";
import { useBoard } from "./useBoard";

export function useStaticBoardState(): StaticBoardState {
  return useBoard().state;
}
