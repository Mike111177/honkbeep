import { UserActionType } from "../../../client/types/UserAction";
import { useBoardReducer, useBoardState } from "../../BoardContext";
import styles from "./ReplayControls.module.css";

const iconSkipBack = "⏮️";
const iconBack = "⏪️";
const iconPause = "⏸";
const iconPlay = "▶️";
const iconFor = "⏩️";
const iconSkipFor = "⏭️";

export function HBReplayControls() {
  const dispatch = useBoardReducer();
  const [viewTurn, latestTurn, paused] = useBoardState((state) => {
    return [state.viewTurn.turn, state.latestTurn.turn, state.paused];
  });

  const setTurn = (turn: number) =>
    dispatch({ type: UserActionType.SetViewTurn, turn });

  const pausePlay = paused
    ? () => dispatch({ type: UserActionType.Resume })
    : () => setTurn(latestTurn);

  const pausePlayIcon = paused ? iconPlay : iconPause;

  return (
    <div className={styles.ReplayControls}>
      <span onClick={() => setTurn(1)}>{iconSkipBack}</span>
      <span onClick={() => setTurn(viewTurn - 1)}>{iconBack}</span>
      <span onClick={pausePlay}>{pausePlayIcon}</span>
      <span onClick={() => setTurn(viewTurn + 1)}>{iconFor}</span>
      <span onClick={() => setTurn(latestTurn)}>{iconSkipFor}</span>
    </div>
  );
}
