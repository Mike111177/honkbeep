import React, { useState, useContext } from "react"

import { CardFloatTarget } from "./CardFloat"
import { GameEventType, PlayResultType } from "../../game/GameTypes"
import { GameUIContext } from '../ReactFrontendInterface'
import HBDeckCard from './HBDeckCard'

import "./HBHand.scss"


type CardInHandProps = {
  player: number,
  index: number
}

function CardInHand({ player, index }: CardInHandProps) {
  const context = useContext(GameUIContext);

  //Update card display on game-event
  const getCurrentCard = () => context.getCardInHand(player, index);
  const [cardIndex, setDisprops] = useState(getCurrentCard());
  context.useGameEvent("game-event", () => setDisprops(getCurrentCard()));

  return (
    <CardFloatTarget index={cardIndex}/>
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

export function HBHandsArea() {
  const playerNames = React.useContext(GameUIContext).getPlayerNames();
  return (
    <div className="HBHandsArea" style={{gridTemplateRows:`repeat(${playerNames.length}, min-content)`}}>
      {playerNames.map((n, i) => <HBHand player={i} key={i} />)}
    </div>
  )
}
