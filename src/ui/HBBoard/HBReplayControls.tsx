import { useCallback, useContext, useEffect, useState } from "react";
import { GameUIContext } from "./ClientState";

const iconSkipBack = "⏮️";
const iconBack = "⏪️";
const iconPause = "⏸";
const iconPlay = "▶️";
const iconFor = "⏩️";
const iconSkipFor = "⏭️";

export function HBReplayControls() {
  const context = useContext(GameUIContext);
  const [latestState, setLatestState] = useState(() => context.latestTurn!);
  const [viewState, setViewState] = useState(() => context.viewTurn!);
  const [paused, setPaused] = useState(() => context.paused);

  const skipBack = useCallback(() => {
    context.pause();
    context.setViewTurn(1);
  }, [context]);

  const back = useCallback(() => {
    if (viewState.game.turn > 1) {
      context.pause();
      context.setViewTurn(viewState.game.turn - 1);
    }
  }, [context, viewState.game.turn]);

  const forward = useCallback(() => {
    if (viewState.game.turn < latestState.game.turn) {
      context.pause();
      context.setViewTurn(viewState.game.turn + 1);
    }
  }, [context, latestState.game.turn, viewState.game.turn]);

  const skipForward = useCallback(() => {
    context.pause();
    context.setViewTurn(latestState.game.turn);
  }, [context, latestState.game.turn]);

  const [inputTurn, setInputTurn] = useState(viewState.game.turn);
  const setTurn = useCallback(
    (event) => {
      if (event.target.value.length > 0) {
        context.pause();
        context.setViewTurn(event.target.valueAsNumber);
      } else {
        setInputTurn(event.target.value);
      }
    },
    [context]
  );

  useEffect(
    () =>
      context.subscribeToStateChange(() => {
        setLatestState(context.latestTurn!);
        setViewState(context.viewTurn!);
        setPaused(context.paused);
        setInputTurn(context.viewTurn!.game.turn);
      }),
    [context]
  );

  return (
    <div style={{ userSelect: "none" }}>
      <span onClick={skipBack}>{iconSkipBack}</span>
      <span onClick={back}>{iconBack}</span>
      <span onClick={paused ? () => context.unpause() : () => context.pause()}>
        {context.paused ? iconPlay : iconPause}
      </span>
      <span onClick={forward}>{iconFor}</span>
      <span onClick={skipForward}>{iconSkipFor}</span>
      <input
        style={{ width: "30px", height: "30px" }}
        type="number"
        value={inputTurn}
        onChange={setTurn}
      />
    </div>
  );
}
