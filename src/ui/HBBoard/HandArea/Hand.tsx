import React from "react";
import * as ArrayUtil from "../../../util/ArrayUtil";
import { useBoardStateSelector, useStaticBoardState } from "../../BoardContext";
import classNames from "../../util/classNames";
import CardTarget from "../AnimatedDeck/CardTarget";

import styles from "./HandArea.css";

type HandCardAreaProps = {
  player: number;
  cards: number;
};
const HandCardArea = React.memo(function HandCardArea({
  player,
  cards,
}: HandCardAreaProps) {
  return (
    <div className={styles.handCardArea}>
      {ArrayUtil.fill(cards, (i) => (
        <CardTarget key={i} areaPath={["hands", player, i]} />
      ))}
    </div>
  );
});

type HandProps = {
  player: number;
};

export default function Hand({ player }: HandProps) {
  const {
    variant: { handSize },
    playerNames,
  } = useStaticBoardState();
  const myTurn = useBoardStateSelector((s) => s.playerOfTurn === player, [
    player,
  ]);

  return (
    <div className={classNames(styles.Hand, styles.OnPlayerTurn, myTurn)}>
      <HandCardArea player={player} cards={handSize} />
      <span className={styles.handName}>{playerNames[player]}</span>
    </div>
  );
}
