import { useBoardStateSelector } from "../../BoardContext";
import { ClueSelector } from "./ClueSelector";

export function ClueArea() {
  return useBoardStateSelector((state) => state.myTurn) ? (
    <ClueSelector />
  ) : null;
}
