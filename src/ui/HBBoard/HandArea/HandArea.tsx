import { useBoardState } from "../../BoardContext";
import Hand from "./Hand";

import styles from "./HandArea.module.css";

export default function HandsArea() {
  const [playerNames, numPlayers, playerView] = useBoardState((boardState) => {
    const numPlayers = boardState.definition.variant.numPlayers;
    let playerView = boardState.playerView;
    if (playerView === undefined) {
      playerView = 0;
    } else if (playerView === -1) {
      playerView = (boardState.viewTurn.turn - 1) % numPlayers;
    }
    return [boardState.definition.playerNames, numPlayers, playerView];
  });
  return (
    <div className={styles.HandsArea}>
      {playerNames.map((n, i) => {
        const player = (i + playerView) % numPlayers;
        return <Hand player={player} key={player} />;
      })}
    </div>
  );
}
