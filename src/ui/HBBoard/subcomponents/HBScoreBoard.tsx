import { useMemo } from "react";
import ArrayUtil from "../../../util/ArrayUtil";
import { useBoardState } from "../types/BoardContext";

import "./HBScoreBoard.scss";

export function HBScoreBoard() {
  const [turn, clues, strikes, stacks] = useBoardState((boardState) => {
    const { turn, clues, strikes, stacks } = boardState.viewTurn;
    return [turn, clues, strikes, stacks];
  });

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
    <div className="HBScoreBoard">
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
