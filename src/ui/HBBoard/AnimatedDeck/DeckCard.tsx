import { ComponentPropsWithoutRef, useMemo } from "react";

import { DrawCard, CardProps } from "../../DrawCard";
import { getPipsFromEmpathy } from "../../../game/types/Empathy";
import { useBoardState } from "../../BoardContext";
import * as ArrayUtil from "../../../util/ArrayUtil";
import { useSpacebar } from "../../input";

export type HBDeckCardProps = {
  index: number;
} & ComponentPropsWithoutRef<"svg">;
export default function HBDeckCard({ index, ...props }: HBDeckCardProps) {
  const [empathy, latestGame, card, definition, deck, touched] = useBoardState(
    (s) => {
      let card = undefined;
      const cardValue = s.shuffleOrder[index];
      if (cardValue !== undefined) {
        let view = s.perspective;
        if (view === undefined) {
          card = cardValue;
        } else {
          if (view === -1) {
            view = (s.viewTurn.turn - 1) % s.definition.variant.numPlayers;
          }
          if (s.latestTurn.cardReveals[view].has(index)) {
            card = cardValue;
          }
        }
      }
      return [
        s.latestTurn.empathy[index],
        s.latestTurn,
        card,
        s.definition,
        s.definition.variant.deck,
        s.viewTurn.cardMeta[index].touched,
      ];
    },
    [index],
    ArrayUtil.shallowCompare
  );
  const pips = useMemo(
    () => getPipsFromEmpathy(empathy, latestGame, deck, definition),
    [deck, definition, empathy, latestGame]
  );
  const cardInfo = useMemo(() => {
    if (card !== undefined) {
      return deck.getCard(card);
    } else {
      return undefined;
    }
  }, [deck, card]);
  const spaceDown = useSpacebar();

  const cardProps = useMemo((): CardProps => {
    const borderOverride = touched ? "orange" : undefined;
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
  }, [cardInfo, definition.variant, pips, props, spaceDown, touched]);
  return <DrawCard {...cardProps} />;
}
