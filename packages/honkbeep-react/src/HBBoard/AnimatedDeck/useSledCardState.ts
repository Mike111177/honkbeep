import { Location, LocationType } from "../../../client/types/Location";
import * as ArrayUtil from "../../../util/ArrayUtil";
import { useBoardStateSelector } from "../../BoardContext";

export function useSledCardState(
  index: number
): [boolean, boolean, boolean, string, Location] {
  return useBoardStateSelector(
    ({ paused, viewTurn, hypothetical, playerOfTurn, myTurn }) => {
      const { location: l } = viewTurn.cardMeta[index];
      const home =
        l.place === LocationType.Hand
          ? `hands-${l.player}-${l.slot}`
          : l.place === LocationType.Stack
          ? `stacks-${l.stack}`
          : l.place === LocationType.Discard
          ? `discard-${l.order}`
          : "deck";
      const cardInCurrentPlayerHand =
        l.place === LocationType.Hand && l.player === playerOfTurn;
      const stack =
        l.place === LocationType.Stack ? viewTurn.stacks[l.stack] : undefined;
      const cardOnTopOfStack =
        stack !== undefined && stack[stack.length - 1] === index;
      const visible =
        cardOnTopOfStack ||
        !(
          l.place === LocationType.Deck ||
          (stack !== undefined && stack[stack.length - 2] !== index)
        );
      return [
        hypothetical || (cardInCurrentPlayerHand && !paused && myTurn),
        cardOnTopOfStack,
        visible,
        home,
        l,
      ];
    },
    [index],
    ArrayUtil.shallowCompare
  );
}
