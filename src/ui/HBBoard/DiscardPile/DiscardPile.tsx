import { useMemo } from "react";

import { useFloatArea } from "../../util/Floating";
import CardTarget from "../CardFloat/CardTarget";
import { useBoardState } from "../../BoardContext";
import classNames from "../../util/classNames";

import styles from "./DiscardPile.module.css";
import darkregion from "../DarkRegion.module.css";

export default function DiscardPile() {
  const [cards, shuffleOrder, deck, suits] = useBoardState((boardState) => {
    return [
      boardState.viewTurn.discardPile,
      boardState.shuffleOrder,
      boardState.deck,
      boardState.definition.variant.suits,
    ];
  });
  const ref = useFloatArea(["discardPile"], { dropZone: true });

  const targets = useMemo(
    () =>
      cards.map((card, i) => {
        const cardValue = deck.getCard(shuffleOrder[card]);
        const suitNumber = suits.findIndex((s) => s === cardValue.suit) + 1;
        return (
          <CardTarget
            key={i}
            areaPath={["discard", card]}
            style={{ gridColumn: suitNumber }}
          />
        );
      }),
    [cards, deck, shuffleOrder, suits]
  );

  return (
    <div
      className={classNames(styles.DiscardPile, darkregion.DarkRegion)}
      ref={ref}
    >
      {targets}
    </div>
  );
}
