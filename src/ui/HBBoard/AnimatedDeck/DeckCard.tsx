import { ComponentPropsWithoutRef, useEffect, useMemo, useState } from "react";

import Card, { CardProps } from "../../Card";
import { getPipsFromEmpathy } from "../../../game/types/Empathy";
import { useBoardState } from "../../BoardContext";
import ArrayUtil from "../../../util/ArrayUtil";

//TODO: PLS REMOVE, REPLACE WITH BETTER THING
let spaceIsDown = false;
const listeners: ((sd: boolean) => void)[] = [];
window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && spaceIsDown === false) {
    spaceIsDown = true;
    listeners.forEach((i) => i(spaceIsDown));
  }
});
window.addEventListener("keyup", (event) => {
  if (event.code === "Space" && spaceIsDown === true) {
    spaceIsDown = false;
    listeners.forEach((i) => i(spaceIsDown));
  }
});

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

  const [spaceDown, setSpaceDown] = useState(spaceIsDown);
  useEffect(() => {
    listeners.push(setSpaceDown);
    return () => {
      listeners.splice(
        listeners.findIndex((i) => i === setSpaceDown),
        1
      );
    };
  }, []);

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
  return <Card {...cardProps} />;
}
