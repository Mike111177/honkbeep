import { ComponentPropsWithoutRef, useMemo } from "react";

import { DrawCard, CardProps } from "../../DrawCard";
import { getPipsFromEmpathy } from "../../../client/types/Empathy";
import { useBoard, useBoardState } from "../../BoardContext";
import * as ArrayUtil from "../../../util/ArrayUtil";
import { useSpacebar } from "../../input";

export type DeckCardProps = {
  index: number;
} & ComponentPropsWithoutRef<"svg">;

export default function DeckCard({ index, ...props }: DeckCardProps) {
  const variant = useBoard().state.variant;
  const [empathy, card, touched] = useBoardState(
    (state) => {
      return [
        state.latestTurn.empathy[index],
        state.getCardIfRevealed(index),
        state.viewTurn.cardMeta[index].touched,
      ];
    },
    [index],
    ArrayUtil.shallowCompare
  );
  const pips = useMemo(() => getPipsFromEmpathy(empathy, variant), [
    empathy,
    variant,
  ]);
  const spaceDown = useSpacebar();
  const cardProps = useMemo((): CardProps => {
    const cardInfo =
      card !== undefined ? variant.deck.getCard(card) : undefined;
    return {
      borderOverride: touched ? "orange" : undefined,
      ...(cardInfo !== undefined && !spaceDown
        ? { card: cardInfo }
        : { variant, pips }),
      ...props,
    };
  }, [card, variant, pips, props, spaceDown, touched]);
  return <DrawCard {...cardProps} />;
}
