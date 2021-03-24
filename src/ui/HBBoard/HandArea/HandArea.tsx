import { useBoardState } from "../../BoardContext";
import Hand from "./Hand";

import styles from "./HandArea.module.css";

export default function HandsArea() {
  const [playerNames, numPlayers, perspective] = useBoardState((boardState) => {
    const numPlayers = boardState.definition.variant.numPlayers;
    let perspective = boardState.perspective;
    if (perspective === undefined) {
      perspective = 0;
    } else if (perspective === -1) {
      perspective = (boardState.viewTurn.turn - 1) % numPlayers;
    }
    return [boardState.definition.playerNames, numPlayers, perspective];
  });
  return (
    <div className={styles.HandsArea}>
      {playerNames.map((n, i) => {
        const player = (i + perspective) % numPlayers;
        return <Hand player={player} key={player} />;
      })}
    </div>
  );
}
