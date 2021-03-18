import { useContext, useEffect, useState } from "react";

import { CardTarget } from "./CardFloat";
import { GameUIContext } from './ClientGameStateManager';

import "./HBHand.scss";

type CardInHandProps = {
  slot: number;
  player: number;
}

function CardInHand({ player, slot }: CardInHandProps) {
  return (
    <CardTarget areaPath={["hands", player, slot]}/>
  );
}

type HBHandProps = {
  player: number;
}

export function HBHand({ player }: HBHandProps) {
  const context = useContext(GameUIContext);
  const playerNames = context.getPlayerNames();
  const cards = context.getPlayerHand(player);
  const [myTurn, setMyTurn] = useState(context.isPlayerTurn(player));
  useEffect(() => {
    const callback = () => {
      setMyTurn(context.isPlayerTurn(player));
    };
    const removeFunc = () => { context.off("game-update", callback) };
    context.on("game-update", callback);
    return removeFunc;
  });

  return (
    <div className={`HBHand${myTurn? " OnPlayerTurn" : ""}`}>
      <div className="handCardArea">
        {cards.map((n, i) => <CardInHand player={player} slot={i} key={i} />)}
      </div>
      <span className="handname">
        {playerNames[player]}
      </span>
    </div>
  );

}

type HBHandsAreaProps = {
  perspective: number;
}
export function HBHandsArea({ perspective }: HBHandsAreaProps) {
  const context = useContext(GameUIContext);
  const playerNames = context.getPlayerNames();
  const numPlayers = context.getNumberOfPlayers();
  return (
    <div className="HBHandsArea">
      {playerNames.map((n, i) => <HBHand player={(i + perspective) % (numPlayers)} key={i} />)}
    </div>
  );
}
