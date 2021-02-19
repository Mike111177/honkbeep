import React from "react"
import HBHand from "./HBHand"
import { GameUIContext } from '../ReactFrontendInterface'

export default function HBHandsArea() {
  const playerNames = React.useContext(GameUIContext).getPlayerNames();
  return (
    <div className="HBHandsArea">
      {playerNames.map((n, i) => <HBHand player={i} key={i} />)}
    </div>
  )
}
