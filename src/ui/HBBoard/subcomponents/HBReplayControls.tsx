import { useCallback, useContext } from "react";
import { BoardContext, useBoardState } from "../types/BoardContext";

const iconSkipBack = "⏮️";
const iconBack = "⏪️";
const iconPause = "⏸";
const iconPlay = "▶️";
const iconFor = "⏩️";
const iconSkipFor = "⏭️";

export function HBReplayControls() {
  const context = useContext(BoardContext);
  const state = useBoardState();
  const latestState = state.latestTurn;
  const viewState = state.viewTurn;
  const paused = context.boardState.paused;

  const skipBack = useCallback(() => {
    context.setViewTurn(1);
  }, [context]);

  const back = useCallback(() => {
    if (viewState.turn > 1) {
      context.setViewTurn(viewState.turn - 1);
    }
  }, [context, viewState.turn]);

  const forward = useCallback(() => {
    if (viewState.turn < latestState.turn) {
      context.setViewTurn(viewState.turn + 1);
    }
  }, [context, latestState.turn, viewState.turn]);

  const skipForward = useCallback(() => {
    context.setViewTurn(latestState.turn);
  }, [context, latestState.turn]);

  return (
    <div style={{ userSelect: "none" }}>
      <span onClick={skipBack}>{iconSkipBack}</span>
      <span onClick={back}>{iconBack}</span>
      <span onClick={paused ? () => context.unpause() : () => context.pause()}>
        {context.boardState.paused ? iconPlay : iconPause}
      </span>
      <span onClick={forward}>{iconFor}</span>
      <span onClick={skipForward}>{iconSkipFor}</span>
    </div>
  );
}
