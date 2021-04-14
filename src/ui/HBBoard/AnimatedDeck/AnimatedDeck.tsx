import { useContext } from "react";
import * as ArrayUtil from "../../../util/ArrayUtil";
import BoardContext from "../../BoardContext";
import AnimatedCard from "./AnimatedCard";
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
        <AnimatedCard key={i} index={i} area={bounds} />
      ))}
    </div>
  );
}
