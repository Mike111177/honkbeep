import { useContext } from "react";
import ArrayUtil from "../../../util/ArrayUtil";
import BoardContext from "../../BoardContext";
import AnimatedCard from "./AnimatedCard";

import styles from "./AnimatedDeck.module.css";

//Create layer for all cards
export default function CardFloatLayer() {
  const context = useContext(BoardContext);
  return (
    <div className={styles.AnimatedDeck}>
      {ArrayUtil.iota(context.boardState.deck.length).map((i) => (
        <AnimatedCard key={i} index={i} />
      ))}
    </div>
  );
}
