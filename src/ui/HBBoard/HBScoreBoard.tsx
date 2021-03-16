import { useContext, useEffect, useMemo, useState } from "react";
import { GameUIContext } from "../ReactFrontendInterface";

import "./HBScoreBoard.scss"

export function HBScoreBoard() {
  const context = useContext(GameUIContext);
  const [gameState, setGameState] = useState(() => context.getViewState());
  useEffect(() => context.subscribeToStateChange(() => setGameState(context.getViewState())), [context]);
  const score = useMemo(() => gameState.game.stacks.reduce((acc, v) => acc + v.length, 0), [gameState.game.stacks]);
  return (
    <div className="HBScoreBoard">
      {`Turn: ${gameState.game.turn}`}
      <br/>
      {`Score: ${score} / 25`}
    </div>
  );
}
