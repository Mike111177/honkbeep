import { ComponentPropsWithoutRef, useMemo } from "react";

import { DrawCard, CardProps } from "../../components/DrawCard";
import { useStaticBoardState, useBoardStateSelector } from "../../BoardContext";
import * as ArrayUtil from "honkbeep-util/ArrayUtil";
import { useSpacebar } from "honkbeep-react/util/input";

export type DeckCardProps = {
  index: number;
} & ComponentPropsWithoutRef<"svg">;

export default function DeckCard({ index, ...props }: DeckCardProps) {
  const { variant } = useStaticBoardState();
  const [card, touched, pips] = useBoardStateSelector(
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
      card !== undefined ? variant.deck.getFaceByCard(card) : undefined;
    return {
      borderOverride: touched ? "orange" : undefined,
      ...(cardInfo !== undefined && !spaceDown
        ? { face: cardInfo }
        : { variant, pips }),
      ...props,
    };
  }, [card, variant, touched, spaceDown, pips, props]);
  return <DrawCard {...cardProps} />;
}
