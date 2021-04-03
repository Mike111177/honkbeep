import { useMemo } from "react";
import ArrayUtil from "../../../util/ArrayUtil";
import { useBoardState } from "../../BoardContext";
import classNames from "../../util/classNames";

import styles from "./ScoreBoard.module.css";
import darkregion from "../DarkRegion.module.css";

export default function ScoreBoard() {
  const [turn, clues, strikes, stacks] = useBoardState(
    ({ viewTurn: { turn, clues, strikes, stacks } }) => [
      turn,
      clues,
      strikes,
      stacks,
    ],
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
      Turn: {turn}
      <br />
      Score: {score} / 25
      <br />
      Clues: <span style={clueStyle}>{clues}</span>
      <br />
      Strikes:{" "}
      {ArrayUtil.fill(3, (i) =>
        i + 1 > strikes ? undefined : (
          <span key={i} style={{ color: "red" }}>
            {" "}
            X{" "}
          </span>
        )
      )}
    </div>
  );
}
