import { ArrayUtil } from "honkbeep-util";
import { useStaticBoardState } from "../../BoardContext";
import { CardSled } from "./CardSled";
import useMeasure from "react-use-measure";
import { ErrorBoundary } from "../../util";

import styles from "./AnimatedDeck.css";

//Create layer for all cards
export default function AnimatedDeck() {
  const cardAmount = useStaticBoardState().variant.deck.length;

  const [ref, bounds] = useMeasure();
  return (
    <div ref={ref} className={styles.AnimatedDeck}>
      <ErrorBoundary>
        {ArrayUtil.iota(cardAmount).map((i) => (
          <CardSled key={i} index={i} area={bounds} />
        ))}
      </ErrorBoundary>
    </div>
  );
}
