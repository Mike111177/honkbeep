import { useContext } from "react";
import * as ArrayUtil from "../../../util/ArrayUtil";
import BoardContext from "../../BoardContext";
import AnimatedCard from "./AnimatedCard";

import styles from "./AnimatedDeck.css";

//Create layer for all cards
export default function CardFloatLayer() {
  const cardAmount = useContext(BoardContext).state.definition.variant.deck
    .length;
  return (
    <div className={styles.AnimatedDeck}>
      {ArrayUtil.iota(cardAmount).map((i) => (
        <AnimatedCard key={i} index={i} />
      ))}
    </div>
  );
}
