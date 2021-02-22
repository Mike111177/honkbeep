import HBClueArea from "./HBClueArea"
import { HBStackArea } from "./HBStack"
import HBDiscardPile from "./HBDiscardPile"
import { DragArea } from "../util/Dragging"
import { CardFloatLayer, CardFloatArea } from "./CardFloat"
import { HBHandsArea } from "./HBHand"
import { GameUIContext, GameUIInterface } from '../ReactFrontendInterface'

import './HBBoard.scss'

type HBBoardProps = {
  game: GameUIInterface
}

export default function HBBoard({ game }: HBBoardProps) {
  return (
    <GameUIContext.Provider value={game}>
      <DragArea>
        <CardFloatArea>
          <div className="HBBoard">
            <div className="HBPlayHistory">
            </div>
            <div className="handsWrapper" style={{ gridRowStart: 1, gridRowEnd: 5, gridColumn: 2 }}>
              <HBHandsArea />
            </div>
            <div className="HBClueHistory" style={{ gridRowStart: 1, gridRowEnd: 3, gridColumn: 3 }} />
            <div className="HBDiscardArea" style={{ gridRowStart: 3, gridRowEnd: 5, gridColumn: 3 }}>
              <HBDiscardPile/>
            </div>
            <HBStackArea />
            <HBClueArea />
            <div className="HBGeneralControls" />
          </div>
          <CardFloatLayer />
        </CardFloatArea>
      </DragArea>
    </GameUIContext.Provider >
  )
}
