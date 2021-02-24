import React, { useContext, useEffect, useState } from "react"

import { CardFloatTarget } from "./CardFloat"
import { DiscardResultType, GameEventType, PlayResultType } from "../../game/GameTypes"
import { GameUIContext } from '../ReactFrontendInterface'

import "./HBHand.scss"
import { Draggable } from "../util/Dragging"


type CardInHandProps = {
  player: number,
  index: number,
  myTurn: boolean
}

function CardInHand({ myTurn, player, index }: CardInHandProps) {
  const context = useContext(GameUIContext);
  const [cardIndex, setCard] = useState(context.getCardInHand(player, index));
  useEffect(()=>{
    const callback = () => {
      const newCardValue = context.getCardInHand(player, index);
      if (newCardValue !== cardIndex){
        setCard(newCardValue);
      }
    };
    const removeFunc = () => {context.off("game-update", callback)};
    context.on("game-update", callback);
    return removeFunc;
  })

  //Make it draggable
  const onDrop = async (loc: string) => {
    if (loc === "stacks") {
      return await context.attemptPlayerAction({
        type: GameEventType.Play,
        player: player,
        handSlot: index,
        result: { type: PlayResultType.Request }
      });
    } else if (loc === "discard") {
      return await context.attemptPlayerAction({
        type: GameEventType.Discard,
        player: player,
        handSlot: index,
        result: { type: DiscardResultType.Request }
      });
    } 
    return false;
  }

  return (
    <CardFloatTarget index={cardIndex} style={{ width: "115px", height: "162px" }} options={{onDrop, draggable: myTurn}}/>
  )
}

type HBHandProps = {
  player: number
}

export function HBHand({ player }: HBHandProps) {
  const context = useContext(GameUIContext);
  const playerNames = context.getPlayerNames();
  const cards = context.getCardsPerHand();
  const cardSlots = [...Array(cards).keys()];
  const [myTurn, setMyTurn]  = useState(context.isPlayerTurn(player));
  useEffect(() => {
    const callback = () => setMyTurn(context.isPlayerTurn(player));
    const removeFunc = () => {context.off("game-update", callback)};
    context.on("game-update", callback);
    return removeFunc;
  });
  return (
    <div className="HBHand" style={myTurn ? { borderWidth: "2px", borderColor: "yellow", borderStyle: "solid", borderRadius: "5px" } : undefined}>
      <div className="handCardArea">
        {cardSlots.map(i => <CardInHand myTurn={myTurn} player={player} index={i} key={i} />)}
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
export function HBHandsArea({perspective}:HBHandsAreaProps) {
  const context = useContext(GameUIContext);
  const playerNames = context.getPlayerNames();
  const numPlayers = context.getNumberOfPlayers();
  return (
    <div className="HBHandsArea" style={{ gridTemplateRows: `repeat(${numPlayers}, min-content)` }}>
      {playerNames.map((n, i) => <HBHand player={(i + perspective) % (numPlayers)} key={i} />)}
    </div>
  )
}
