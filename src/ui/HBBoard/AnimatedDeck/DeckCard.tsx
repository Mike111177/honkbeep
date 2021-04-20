import { ComponentPropsWithoutRef, useMemo } from "react";

import { DrawCard, CardProps } from "../../DrawCard";
import { getPipsFromEmpathy } from "../../../client/types/Empathy";
import { useBoard, useBoardState } from "../../BoardContext";
import * as ArrayUtil from "../../../util/ArrayUtil";
import { useSpacebar } from "../../input";

export type HBDeckCardProps = {
  index: number;
} & ComponentPropsWithoutRef<"svg">;
export default function HBDeckCard({ index, ...props }: HBDeckCardProps) {
  const definition = useBoard().state.definition;
  const [empathy, card, touched] = useBoardState(
    (s) => {
      let card = undefined;
      const cardValue = s.shuffleOrder[index];
      if (cardValue !== undefined) {
        let view = s.perspective;
        if (view === undefined) {
          card = cardValue;
        } else {
          if (view === -1) {
            view = (s.viewTurn.turn - 1) % definition.variant.numPlayers;
          }
          if (s.latestTurn.cardReveals[view].has(index)) {
            card = cardValue;
          }
        }
      }
      return [
        s.latestTurn.empathy[index],
        card,
        s.viewTurn.cardMeta[index].touched,
      ];
    },
    [definition.variant.numPlayers, index],
    ArrayUtil.shallowCompare
  );
  const pips = useMemo(
    () => getPipsFromEmpathy(empathy, definition.variant.deck, definition),
    [definition, empathy]
  );
  const spaceDown = useSpacebar();
  const cardProps = useMemo((): CardProps => {
    const borderOverride = touched ? "orange" : undefined;
    const cardInfo =
      card !== undefined ? definition.variant.deck.getCard(card) : undefined;
    if (cardInfo !== undefined && !spaceDown) {
      return {
        borderOverride,
        card: cardInfo,
        ...props,
      };
    } else {
      return {
        borderOverride,
        variant: definition.variant,
        pips,
        ...props,
      };
    }
  }, [card, definition.variant, pips, props, spaceDown, touched]);
  return <DrawCard {...cardProps} />;
}
