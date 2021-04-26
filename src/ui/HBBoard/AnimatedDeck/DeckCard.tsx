import { ComponentPropsWithoutRef, useMemo } from "react";

import { DrawCard, CardProps } from "../../components/DrawCard";
import { useBoard, useBoardState } from "../../BoardContext";
import * as ArrayUtil from "../../../util/ArrayUtil";
import { useSpacebar } from "../../input";

export type DeckCardProps = {
  index: number;
} & ComponentPropsWithoutRef<"svg">;

export default function DeckCard({ index, ...props }: DeckCardProps) {
  const variant = useBoard().state.variant;
  const [card, touched, pips] = useBoardState(
    (state) => {
      const { touched, cluedPips } = state.viewTurn.cardMeta[index];
      return [state.getCardIfRevealed(index), touched, cluedPips];
    },
    [index],
    ArrayUtil.shallowCompare
  );
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
  }, [card, variant, touched, spaceDown, pips, props]);
  return <DrawCard {...cardProps} />;
}
