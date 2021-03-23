import { useMemo } from "react";

import { useFloatArea } from "../../util/Floating";
import { CardTarget } from "../CardFloat/CardFloat";
import { useBoardState } from "../../BoardContext";

import styles from "./DiscardPile.module.css";
import darkregion from "../DarkRegion.module.css";

export default function DiscardPile() {
  const [cards, shuffleOrder, deck] = useBoardState((boardState) => {
    return [
      boardState.viewTurn.discardPile,
      boardState.shuffleOrder,
      boardState.deck,
    ];
  });
  const ref = useFloatArea(["discardPile"], { dropZone: true });

  //TODO: Fix this..........
  const cardOrder = useMemo(
    () =>
      cards
        .map((index) => ({
          index,
          ...deck.getCard(shuffleOrder[index]),
        }))
        .sort((a, b) =>
          a.suit < b.suit ? -1 : a.suit > b.suit ? 1 : a.rank - b.rank
        )
        .map((i) => i.index),
    [cards, deck, shuffleOrder]
  );
  return (
    <div
      className={[styles.DiscardPile, darkregion.DarkRegion].join(" ")}
      ref={ref}
    >
      {cardOrder.map((i) => (
        <CardTarget key={i} areaPath={["discard", i]} />
      ))}
    </div>
  );
}
