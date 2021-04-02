import { ComponentPropsWithoutRef, useEffect, useMemo, useState } from "react";

import Card, { CardProps } from "../../Card";
import { getPipsFromEmpathy } from "../../../game/types/Empathy";
import { useBoardState } from "../../BoardContext";

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
    (boardState) => {
      let card = undefined;
      const cardValue = boardState.shuffleOrder[index];
      if (cardValue !== undefined) {
        let view = boardState.perspective;
        if (view === undefined) {
          card = cardValue;
        } else {
          if (view === -1) {
            view =
              (boardState.viewTurn.turn - 1) %
              boardState.definition.variant.numPlayers;
          }
          if (boardState.latestTurn.cardReveals[view].has(index)) {
            card = cardValue;
          }
        }
      }
      return [
        boardState.latestTurn.empathy[index],
        boardState.latestTurn,
        card,
        boardState.definition,
        boardState.definition.variant.deck,
        boardState.viewTurn.cardMeta[index].touched,
      ];
    }
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
