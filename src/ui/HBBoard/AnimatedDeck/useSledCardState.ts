import * as ArrayUtil from "../../../util/ArrayUtil";
import { useBoardState } from "../../BoardContext";
import { ZonePath } from "../../Zone";
import { getCardHome } from "./getCardHome";

export function useSledCardState(
  index: number
): [boolean, boolean, boolean, ...ZonePath] {
  return useBoardState(
    ({ paused, viewTurn, hypothetical, variant }) => {
      const home = getCardHome(index, viewTurn);
      const cardInCurrentPlayerHand =
        home[0] === "hands" &&
        home[1] === (viewTurn.turn - 1) % variant.numPlayers;
      const stack =
        home[0] === "stacks" ? viewTurn.stacks[home[1] as number] : undefined;
      const cardOnTopOfStack =
        stack !== undefined && stack[stack.length - 1] === index;
      const visible =
        cardOnTopOfStack ||
        !(
          home[0] === "deck" ||
          (stack !== undefined && stack[stack.length - 2] !== index)
        );
      return [
        cardInCurrentPlayerHand && (!paused || hypothetical),
        cardOnTopOfStack,
        visible,
        ...home,
      ];
    },
    [index],
    ArrayUtil.shallowCompare
  );
}
