import { useContext, useEffect, useState } from "react";
import { GameUIContext } from "../ReactFrontendInterface";
import { CardTarget } from "./CardFloat";

export function HBDeck() {
  const context = useContext(GameUIContext);
  const [gameState, setGameState] = useState(() => context.geViewState());
  useEffect(() => context.subscribeToStateChange(() => setGameState(context.geViewState())), [context]);

  return (
    <CardTarget areaPath={["deck"]}>
      <rect x="5%" y="5%" width="90%" height="90%" fill="#cccccc80" rx="5%" />
      <rect x="5%" y="5%" width="90%" height="90%" fill="#00000000" strokeWidth="4%" stroke="#00000080" rx="5%" />
      <rect x="5%" y="5%" width="90%" height="90%" fill="#00000000" strokeWidth="2.5%" stroke="#77777780" rx="5%" />
      <text x="50%" y="50%" fontSize="50px" dominantBaseline="middle" textAnchor="middle" fill="#FFFFFF" filter="url(#outline)">
        {`${gameState.game.deck.length - gameState.game.topDeck + 1}`}
      </text>
    </CardTarget>
  );
}
