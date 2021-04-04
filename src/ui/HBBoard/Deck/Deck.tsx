import CardTarget from "../AnimatedDeck/CardTarget";
import { useBoardState } from "../../BoardContext";

import styles from "./Deck.module.css";
import ArrayUtil from "../../../util/ArrayUtil";

export default function Deck() {
  const [deck, topDeck] = useBoardState(
    (s) => {
      return [s.definition.variant.deck, s.viewTurn.topDeck];
    },
    [],
    ArrayUtil.shallowCompare
  );

  return (
    <CardTarget className={styles.Deck} areaPath={["deck"]}>
      <rect x="5%" y="5%" width="90%" height="90%" fill="#cccccc80" rx="5%" />
      <rect
        x="5%"
        y="5%"
        width="90%"
        height="90%"
        fill="#00000000"
        strokeWidth="4%"
        stroke="#00000080"
        rx="5%"
      />
      <rect
        x="5%"
        y="5%"
        width="90%"
        height="90%"
        fill="#00000000"
        strokeWidth="2.5%"
        stroke="#77777780"
        rx="5%"
      />
      <text
        x="50%"
        y="50%"
        fontSize="50px"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#FFFFFF"
        filter="url(#outline)"
      >
        {deck.length - topDeck + 1}
      </text>
    </CardTarget>
  );
}
