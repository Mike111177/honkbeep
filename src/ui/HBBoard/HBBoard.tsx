import HBClueArea from "./HBClueArea/HBClueArea"
import HBStackArea from "./HBStackArea/HBStackArea"
import HBHandsArea from "./HBHandsArea/HBHandsArea"
import { GameUIContext, GameUIInterface } from '../ReactFrontendInterface'

import './HBBoard.scss'

type HBBoardProps = {
  game: GameUIInterface
}

export default function HBBoard({ game }: HBBoardProps) {
  return (
    <GameUIContext.Provider value={game}>
      <div className="HBBoard">
        <div className="HBPlayHistory">
        </div>
        <div className="handsWrapper" style={{ gridRowStart: 1, gridRowEnd: 5, gridColumn: 2 }}>
          <HBHandsArea />
        </div>
        <div className="HBClueHistory" style={{ gridRowStart: 1, gridRowEnd: 3, gridColumn: 3 }} />
        <div className="HBDiscardArea" style={{ gridRowStart: 3, gridRowEnd: 5, gridColumn: 3 }} />
        <HBStackArea />
        <HBClueArea />
        <div className="HBGeneralControls" />
      </div>
    </GameUIContext.Provider>
  )
}
