import React, { useState, useContext } from "react"
import { Draggable } from "../Dragging"

import { GameEventType, PlayResultType } from "../../game/GameTypes"
import { GameUIContext } from '../ReactFrontendInterface'
import HBCard, { HBCardProps } from "./HBCard"

import "./HBHand.scss"

type CardInHandProps = {
  player: number,
  index: number
}

function CardInHand({ player, index }: CardInHandProps) {
  const context = useContext(GameUIContext);

  //Update card display on game-event
  const getCurrentDisplayProps = () => context.getCardDisplayableProps(context.getCardInHand(player, index));
  const [cardInfo, setDisprops] = useState(getCurrentDisplayProps());
  context.useGameEvent("game-event", () => setDisprops(getCurrentDisplayProps()));

  const onDrop = (place:string)=>{
    context.attemptPlayerAction({
      type: GameEventType.Play,
      player: player,
      handSlot: index,
      result: {type: PlayResultType.Request}
    });
  };

  return (
    <Draggable onDrop={onDrop} className="cardInHand">
      <HBCard {...cardInfo} />
    </Draggable>
  )
}

type HBHandProps = {
  player: number
}

export default function HBHand({ player }: HBHandProps) {
  const context = useContext(GameUIContext);
  const playerNames = context.getPlayerNames();
  const cards = context.getCardsPerHand();
  const cardSlots = [...Array(cards).keys()];
  return (
    <div className="HBHand">
      <div className="handCardArea">
        {cardSlots.map(i => <CardInHand player={player} index={i} key={i} />)}
      </div>
      <div className="handNameArea">
        {playerNames[player]}
      </div>
    </div>
  )

}
