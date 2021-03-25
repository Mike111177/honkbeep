import ArrayUtil from "../../../util/ArrayUtil";
import { useBoardState } from "../../BoardContext";
import classNames from "../../util/classNames";
import CardTarget from "../AnimatedDeck/CardTarget";

import styles from "./HandArea.module.css";

type HandProps = {
  player: number;
};

export default function Hand({ player }: HandProps) {
  const [playerNames, cardsInHand, myTurn] = useBoardState((boardState) => {
    return [
      boardState.definition.playerNames,
      boardState.viewTurn.hands[player].length,
      player ===
        (boardState.viewTurn.turn - 1) %
          boardState.definition.variant.numPlayers,
    ];
  });

  const targets = ArrayUtil.fill(cardsInHand, (i) => (
    <CardTarget key={i} areaPath={["hands", player, i]} />
  ));

  return (
    <div className={classNames(styles.Hand, styles.OnPlayerTurn, myTurn)}>
      <div className={styles.handCardArea}>{targets}</div>
      <span className={styles.handName}>{playerNames[player]}</span>
    </div>
  );
}
