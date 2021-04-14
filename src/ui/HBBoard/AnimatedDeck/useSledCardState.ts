import * as ArrayUtil from "../../../util/ArrayUtil";
import { useBoardState } from "../../BoardContext";
import { FloatAreaPath } from "../../util/Floating";
import { getCardHome } from "./getCardHome";

export function useSledCardState(
  index: number
): [boolean, boolean, boolean, ...FloatAreaPath] {
  return useBoardState(
    ({ paused, viewTurn, definition: { variant } }) => {
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
        cardInCurrentPlayerHand && !paused,
        cardOnTopOfStack,
        visible,
        ...home,
      ];
    },
    [index],
    ArrayUtil.shallowCompare
  );
}
