import { useMemo } from "react";

import { useFloatArea } from "../../util/Floating";
import CardTarget from "../AnimatedDeck/CardTarget";
import { useBoardState } from "../../BoardContext";
import classNames from "../../util/classNames";

import styles from "./DiscardPile.module.css";
import darkregion from "../DarkRegion.module.css";

export default function DiscardPile() {
  const [cards, shuffleOrder, deck, suits] = useBoardState((boardState) => {
    return [
      boardState.viewTurn.discardPile,
      boardState.shuffleOrder,
      boardState.definition.variant.deck,
      boardState.definition.variant.suits,
    ];
  });
  const ref = useFloatArea(["discardPile"], { dropZone: true });

  const targets = useMemo(() => {
    const cardValues = cards.map((c) => deck.getCard(shuffleOrder[c]));
    const suitsPresent = suits.filter(
      (s) => cardValues.find((c) => c.suit === s) !== undefined
    );
    return cards.map((card, i) => {
      const cardValue = cardValues[i];
      const suitNumber =
        suitsPresent.findIndex((s) => s === cardValue.suit) + 1;
      return (
        <CardTarget
          key={i}
          areaPath={["discard", card]}
          style={{ gridColumn: suitNumber }}
        />
      );
    });
  }, [cards, deck, shuffleOrder, suits]);

  return (
    <div
      className={classNames(styles.DiscardPile, darkregion.DarkRegion)}
      ref={ref}
    >
      {targets}
    </div>
  );
}
