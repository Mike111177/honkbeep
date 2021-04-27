import * as ArrayUtil from "../../../util/ArrayUtil";
import { useBoardStateSelector } from "../../BoardContext";
import classNames from "../../util/classNames";
import CardTarget from "../AnimatedDeck/CardTarget";

import styles from "./HandArea.css";

type HandProps = {
  player: number;
};

export default function Hand({ player }: HandProps) {
  const [playerNames, cardsInHand, myTurn] = useBoardStateSelector(
    ({ playerNames, variant: { numPlayers }, viewTurn }) => {
      return [
        playerNames,
        viewTurn.hands[player].length,
        player === (viewTurn.turn - 1) % numPlayers,
      ];
    },
    [player],
    ArrayUtil.shallowCompare
  );

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
