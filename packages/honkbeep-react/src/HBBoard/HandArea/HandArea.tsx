import * as ArrayUtil from "../../../util/ArrayUtil";
import { useBoardStateSelector } from "../../BoardContext";
import Hand from "./Hand";

import styles from "./HandArea.css";

export default function HandsArea() {
  const [playerNames, numPlayers, playerView] = useBoardStateSelector(
    (boardState) => {
      const numPlayers = boardState.variant.numPlayers;
      let playerView = boardState.viewOrder;
      if (playerView === undefined) {
        playerView = 0;
      } else if (playerView === -1) {
        playerView = (boardState.viewTurn.turn - 1) % numPlayers;
      }
      return [boardState.playerNames, numPlayers, playerView];
    },
    [],
    ArrayUtil.shallowCompare
  );
  return (
    <div className={styles.HandsArea}>
      {playerNames.map((n, i) => {
        const player = (i + playerView) % numPlayers;
        return <Hand player={player} key={player} />;
      })}
    </div>
  );
}
