import { LocationType, Location } from "../../../client/types/Location";
import * as ArrayUtil from "../../../util/ArrayUtil";
import { useBoardStateSelector } from "../../BoardContext";
import { ZonePath } from "../../Zone";

//May as well store this as a const
const deckPath: ZonePath = ["deck"];

function getCardHome(location: Location): ZonePath {
  switch (location.place) {
    case LocationType.Hand:
      return ["hands", location.player, location.slot];
    case LocationType.Stack:
      return ["stacks", location.stack];
    case LocationType.Discard:
      return ["discard", location.order];
    default:
      return deckPath;
  }
}

export function useSledCardState(
  index: number
): [boolean, boolean, boolean, ...ZonePath] {
  return useBoardStateSelector(
    ({ paused, viewTurn, hypothetical, playerOfTurn, myTurn }) => {
      const { location } = viewTurn.cardMeta[index];
      const home = getCardHome(location);
      const cardInCurrentPlayerHand =
        location.place === LocationType.Hand &&
        location.player === playerOfTurn;
      const stack =
        location.place === LocationType.Stack
          ? viewTurn.stacks[location.stack]
          : undefined;
      const cardOnTopOfStack =
        stack !== undefined && stack[stack.length - 1] === index;
      const visible =
        cardOnTopOfStack ||
        !(
          location.place === LocationType.Deck ||
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
