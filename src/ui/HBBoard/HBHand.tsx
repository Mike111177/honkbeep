import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { CardFloatTarget } from "./CardFloat";
import { GameEventType } from "../../game/GameTypes";
import { GameUIContext } from '../ReactFrontendInterface';

import "./HBHand.scss";

type CardInHandProps = {
  index: number;
  myTurn: boolean;
  card: number;
  player: number;
}

function CardInHand({ myTurn, player, index, card }: CardInHandProps) {
  const context = useContext(GameUIContext);

  //Make it draggable
  const onDrop = useCallback(async (loc: string) => {
    switch (loc) {
      case "stacks":
        return await context.attemptPlayerAction({
          type: GameEventType.Play,
          handSlot: index
        });
      case "discard":
        return await context.attemptPlayerAction({
          type: GameEventType.Discard,
          handSlot: index
        });
      default:
        return false;
    }
  }, [context, index]);

  const floatOptions = useMemo(() => ({ onDrop, draggable: myTurn&&(player===0) }), [myTurn, onDrop, player]);
  const style = useMemo(() => ({ width: "110px", height: "150px" }), []);

  return (
    <CardFloatTarget index={card} style={style} options={floatOptions}>
      <svg viewBox="0 0 110 150"></svg>
    </CardFloatTarget>
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
  const cardAreaStyle = useMemo(() => ({ gridTemplateColumns:"auto ".repeat(cards.length)}), [cards.length]);
  return (
    <div className={`HBHand${myTurn? " OnPlayerTurn" : ""}`}>
      <div className="handCardArea" style={cardAreaStyle}>
        {cards.map((n, i) => <CardInHand myTurn={myTurn} player={player} card={n} index={i} key={i} />)}
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
    <div className="HBHandsArea" style={{ gridTemplateRows: `repeat(${numPlayers}, min-content)` }}>
      {playerNames.map((n, i) => <HBHand player={(i + perspective) % (numPlayers)} key={i} />)}
    </div>
  );
}
