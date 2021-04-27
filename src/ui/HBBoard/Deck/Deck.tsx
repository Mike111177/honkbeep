import CardTarget from "../AnimatedDeck/CardTarget";
import { useBoardStateSelector } from "../../BoardContext";
import * as ArrayUtil from "../../../util/ArrayUtil";

import styles from "./Deck.css";

export default function Deck() {
  const [deck, topDeck] = useBoardStateSelector(
    (s) => {
      return [s.variant.deck, s.viewTurn.topDeck];
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
        strokeWidth="4"
        stroke="black"
        paintOrder="stroke"
      >
        {deck.length - topDeck + 1}
      </text>
    </CardTarget>
  );
}
