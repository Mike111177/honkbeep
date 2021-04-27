import { UserActionType } from "../../../client/types/UserAction";
import * as ArrayUtil from "../../../util/ArrayUtil";
import { useBoardReducer, useBoardStateSelector } from "../../BoardContext";
import { ErrorBoundary } from "../../util/ErrorBoundry";
import styles from "./ReplayControls.css";

const iconSkipBack = "⏮️";
const iconBack = "⏪️";
const iconPause = "⏸";
const iconPlay = "▶️";
const iconFor = "⏩️";
const iconSkipFor = "⏭️";
const iconHypothetical = "❓";
const iconExit = "❌";

export default function ReplayControls() {
  const dispatch = useBoardReducer();
  const [viewTurn, latestTurn, paused, hypothetical] = useBoardStateSelector(
    (state) => {
      return [
        state.viewTurn.turn,
        state.latestTurn.turn,
        state.paused,
        state.hypothetical,
      ];
    },
    [],
    ArrayUtil.shallowCompare
  );

  const setTurn = (turn: number) =>
    dispatch({ type: UserActionType.SetViewTurn, turn });

  return (
    <div className={styles.ReplayControls}>
      <ErrorBoundary>
        <span onClick={() => setTurn(1)}>{iconSkipBack}</span>
        <span onClick={() => setTurn(viewTurn - 1)}>{iconBack}</span>
        {paused ? (
          <span onClick={() => dispatch({ type: UserActionType.Resume })}>
            {iconPlay}
          </span>
        ) : (
          <span onClick={() => setTurn(viewTurn)}>{iconPause}</span>
        )}
        <span onClick={() => setTurn(viewTurn + 1)}>{iconFor}</span>
        <span onClick={() => setTurn(latestTurn)}>{iconSkipFor}</span>
        {hypothetical ? (
          <span
            onClick={() => dispatch({ type: UserActionType.EndHypothetical })}
          >
            {iconExit}
          </span>
        ) : (
          <span
            onClick={() => dispatch({ type: UserActionType.StartHypothetical })}
          >
            {iconHypothetical}
          </span>
        )}
      </ErrorBoundary>
    </div>
  );
}
