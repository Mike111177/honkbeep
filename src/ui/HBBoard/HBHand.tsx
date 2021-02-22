import React, { useState, useContext } from "react"

import { CardFloatTarget } from "./CardFloat"
import { DiscardResultType, GameEventType, PlayResultType } from "../../game/GameTypes"
import { GameUIContext } from '../ReactFrontendInterface'
import HBDeckCard from './HBDeckCard'

import "./HBHand.scss"
import { Draggable } from "./Dragging"


type CardInHandProps = {
  player: number,
  index: number,
  myTurn: boolean
}

function CardInHand({ myTurn, player, index }: CardInHandProps) {
  const context = useContext(GameUIContext);

  //Update card display on game-event
  const getCurrentCard = () => context.getCardInHand(player, index);
  const [cardIndex, setDisprops] = useState(getCurrentCard());
  context.useGameEvent("game-event", () => setDisprops(getCurrentCard()));

  //Make it draggable
  const onDrop = (loc:string)=>{
    if (loc==="stacks"){
      context.attemptPlayerAction({
        type: GameEventType.Play,
        player: player,
        handSlot: index,
        result: {type: PlayResultType.Request}
      });
    } else if (loc==="discard"){
      context.attemptPlayerAction({
        type: GameEventType.Discard,
        player: player,
        handSlot: index,
        result: { type: DiscardResultType.Request }
      });
    }
  }
  const dragWrapper = (o:Element)=>{
    return (
      <Draggable onDrop={onDrop}>
        {o}
      </Draggable>
    )
  }

  return (
    <CardFloatTarget wrap={myTurn ? dragWrapper : undefined} index={cardIndex} style={{width: "115px", height: "162px"}}/>
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
  const [myTurn, setMyTurn] = useState(context.isPlayerTurn(player));
  context.useGameEvent("game-event", () => setMyTurn(context.isPlayerTurn(player)));
  return (
    <div className="HBHand" style={myTurn ? {borderWidth:"2px", borderColor:"yellow", borderStyle:"solid", borderRadius:"5px"} : undefined}>
      <div className="handCardArea">
        {cardSlots.map(i => <CardInHand myTurn={myTurn} player={player} index={i} key={i} />)}
      </div>
      <div className="handNameArea">
        {playerNames[player]}
      </div>
    </div>
  )

}

export function HBHandsArea() {
  const playerNames = useContext(GameUIContext).getPlayerNames();
  return (
    <div className="HBHandsArea" style={{gridTemplateRows:`repeat(${playerNames.length}, min-content)`}}>
      {playerNames.map((n, i) => <HBHand player={i} key={i} />)}
    </div>
  )
}
