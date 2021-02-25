import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"

import { CardFloatTarget } from "./CardFloat"
import { DiscardResultType, GameEventType, PlayResultType } from "../../game/GameTypes"
import { GameUIContext } from '../ReactFrontendInterface'

import "./HBHand.scss"

type CardInHandProps = {
  player: number,
  index: number,
  myTurn: boolean,
  card: number
}

function CardInHand({ myTurn, player, index, card }: CardInHandProps) {
  const context = useContext(GameUIContext);

  //Make it draggable
  const onDrop = useCallback(async (loc: string) => {
    switch (loc) {
      case "stacks":
        return await context.attemptPlayerAction({
          type: GameEventType.Play,
          player: player,
          handSlot: index,
          result: { type: PlayResultType.Request }
        });
      case "discard":
        return await context.attemptPlayerAction({
          type: GameEventType.Discard,
          player: player,
          handSlot: index,
          result: { type: DiscardResultType.Request }
        });
      default:
        return false;
    }
  }, [context, index, player]);

  const floatOptions = useMemo(() => ({ onDrop, draggable: myTurn, injectProps: {opacity: "50%"} }), [myTurn, onDrop])
  const style = useMemo(() => ({ width: "115px", height: "162px" }), [])

  return (
    <CardFloatTarget index={card} style={style} options={floatOptions} />
  )
}

type HBHandProps = {
  player: number
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
    <div className="HBHand" style={myTurn ? { borderWidth: "2px", borderColor: "yellow", borderStyle: "solid", borderRadius: "5px" } : undefined}>
      <div className="handCardArea">
        {cards.map((n, i) => <CardInHand myTurn={myTurn} card={n} player={player} index={i} key={i} />)}
      </div>
      <div className="handNameArea">
        {playerNames[player]}
      </div>
    </div>
  )

}

type HBHandsAreaProps = {
  perspective: number
}
export function HBHandsArea({ perspective }: HBHandsAreaProps) {
  const context = useContext(GameUIContext);
  const playerNames = context.getPlayerNames();
  const numPlayers = context.getNumberOfPlayers();
  return (
    <div className="HBHandsArea" style={{ gridTemplateRows: `repeat(${numPlayers}, min-content)` }}>
      {playerNames.map((n, i) => <HBHand player={(i + perspective) % (numPlayers)} key={i} />)}
    </div>
  )
}
