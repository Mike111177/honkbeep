import { useContext } from "react";
import * as ArrayUtil from "../../../util/ArrayUtil";
import { useStaticBoardState, useBoardStateSelector } from "../../BoardContext";
import { CardSled } from "./CardSled";
import useMeasure from "react-use-measure";
import { ErrorBoundary } from "../../util";

import styles from "./AnimatedDeck.css";

//Create layer for all cards
export default function AnimatedDeck() {
  const { deck } = useStaticBoardState().variant;
  const cardAmount = deck.length;

  const discardZIndices = useBoardStateSelector(
    (state) => {
      const sortedPile = Array.from(state.viewTurn.discardPile.entries()).sort(([i, a], [j, b]) => {
        let cmp = deck.lookup[state.shuffleOrder[a]] - deck.lookup[state.shuffleOrder[b]];
        if (cmp == 0) {
          return i - j;
        }
        return cmp;
      });
      const zIndices = new Map();
      for (const [z, [i, card]] of sortedPile.entries()) {
        zIndices.set(i, z);
      }
      return zIndices;
    }
  );

  const [ref, bounds] = useMeasure();
  return (
    <div ref={ref} className={styles.AnimatedDeck}>
      <ErrorBoundary>
        {ArrayUtil.iota(cardAmount).map((i) => (
          <CardSled key={i} index={i} area={bounds} discardZIndices={discardZIndices} />
        ))}
      </ErrorBoundary>
    </div>
  );
}
