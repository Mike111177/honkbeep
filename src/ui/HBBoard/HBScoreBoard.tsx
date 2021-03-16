import { useContext, useEffect, useMemo, useState } from "react";
import { GameUIContext } from "../ReactFrontendInterface";
export function HBScoreBoard() {
  const context = useContext(GameUIContext);
  const [gameState, setGameState] = useState(() => context.geViewState());
  useEffect(() => context.subscribeToStateChange(() => setGameState(context.geViewState())), [context]);
  const score = useMemo(() => gameState.game.stacks.reduce((acc, v) => acc + v.length, 0), [gameState.game.stacks]);
  return (
    <div className="HBScoreBoard">
      {`Turn: ${gameState.game.turn}`}
      <br/>
      {`Score: ${score} / 25`}
    </div>
  );
}
