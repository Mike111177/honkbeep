import React from "react"

import HBStack from "./HBStack"
import { DropZone } from "./CardFloat";
import { GameUIContext } from '../ReactFrontendInterface'

import "./HBStackArea.scss"


export default function HBStackArea() {
  const suits = React.useContext(GameUIContext).getSuits();
  return (
    <DropZone id="stacks">
      <div className="HBStackArea" style={{ gridTemplateColumns: `repeat(${suits.length}, auto)` }}>
        {suits.map((c, i) => <HBStack suit={c} key={i} number={i} />)}
      </div>
    </DropZone>
  )
}
