import React from "react"
import HBHand from "./HBHand"
import {GameDefinitionContext} from '../../Game'

export default function HBHandsArea() {
  const { playerNames } = React.useContext(GameDefinitionContext)
  return (
    <div className="HBHandsArea">
      {playerNames.map((n, i) => <HBHand player={i} key={i} />)}
    </div>
  )
}