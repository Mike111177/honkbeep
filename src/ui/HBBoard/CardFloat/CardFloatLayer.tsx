import { useContext } from "react";
import ArrayUtil from "../../../util/ArrayUtil";
import BoardContext from "../../BoardContext";
import FloatingCard from "./CardFloat";

import styles from "./CardFloat.module.css";

//Create layer for all cards
export default function CardFloatLayer() {
  const context = useContext(BoardContext);
  return (
    <div className={styles.CardFloatLayer}>
      {ArrayUtil.iota(context.boardState.deck.length).map((i) => (
        <FloatingCard key={i} index={i} />
      ))}
    </div>
  );
}
