import { useMemo } from "react";
import * as ArrayUtil from "honkbeep-util/ArrayUtil";
import { useBoardStateSelector } from "../../BoardContext";
import classNames from "../../util/classNames";
import { ErrorBoundary } from "../../util/ErrorBoundry";

import styles from "./ScoreBoard.css";
import darkregion from "../DarkRegion.css";

export default function ScoreBoard() {
  const [turn, clues, strikes, stacks] = useBoardStateSelector(
    ({ viewTurn: { turn, clues, strikes, stacks } }) => [
      turn,
      clues,
      strikes,
      stacks,
    ],
    [],
    ArrayUtil.shallowCompare
  );

  const score = useMemo(() => stacks.reduce((acc, v) => acc + v.length, 0), [
    stacks,
  ]);

  //Pick the color for the clue count indicator
  const clueStyle = {
    color:
      clues === 8
        ? "lightgreen"
        : clues === 0
        ? "red"
        : clues === 1
        ? "yellow"
        : "white",
  };

  return (
    <div className={classNames(styles.ScoreBoard, darkregion.DarkRegion)}>
      <ErrorBoundary>
        Turn: {turn}
        <br />
        Score: {score} / 25
        <br />
        Clues: <span style={clueStyle}>{clues}</span>
        <br />
        Strikes:
        {ArrayUtil.fill(3, (i) => (i + 1 > strikes ? null : "❌")).join("")}
      </ErrorBoundary>
    </div>
  );
}
