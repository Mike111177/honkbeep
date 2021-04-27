import * as ArrayUtil from "../../../util/ArrayUtil";
import { useBoardStateSelector } from "../../BoardContext";
import { ZonePath } from "../../Zone";
import { getCardHome } from "./getCardHome";

export function useSledCardState(
  index: number
): [boolean, boolean, boolean, ...ZonePath] {
  return useBoardStateSelector(
    ({ paused, viewTurn, hypothetical, playerOfTurn, myTurn }) => {
      const home = getCardHome(index, viewTurn);
      const cardInCurrentPlayerHand =
        home[0] === "hands" && home[1] === playerOfTurn;
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
        hypothetical || (cardInCurrentPlayerHand && !paused && myTurn),
        cardOnTopOfStack,
        visible,
        ...home,
      ];
    },
    [index],
    ArrayUtil.shallowCompare
  );
}
