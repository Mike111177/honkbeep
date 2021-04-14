import { useContext } from "react";
import * as ArrayUtil from "../../../util/ArrayUtil";
import BoardContext from "../../BoardContext";
import { CardSled } from "./CardSled";
import useMeasure from "react-use-measure";

import styles from "./AnimatedDeck.css";

//Create layer for all cards
export default function AnimatedDeck() {
  const cardAmount = useContext(BoardContext).state.definition.variant.deck
    .length;
  const [ref, bounds] = useMeasure();
  return (
    <div ref={ref} className={styles.AnimatedDeck}>
      {ArrayUtil.iota(cardAmount).map((i) => (
        <CardSled key={i} index={i} area={bounds} />
      ))}
    </div>
  );
}
