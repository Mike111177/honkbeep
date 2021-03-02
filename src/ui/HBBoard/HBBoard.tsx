import HBClueArea from "./HBClueArea";
import { HBStackArea } from "./HBStack";
import HBDiscardPile from "./HBDiscardPile";
import { DragArea } from "../util/Dragging";
import { CardFloatLayer, CardFloatArea } from "./CardFloat";
import { HBHandsArea } from "./HBHand";
import HBPlayHistory from "./HBPlayHistory";
import ReactUIInterface, { GameUIContext } from '../ReactFrontendInterface';

import './HBBoard.scss';

type HBBoardProps = {
  game: ReactUIInterface;
}

export default function HBBoard({ game }: HBBoardProps) {
  return (
    <GameUIContext.Provider value={game}>
      <DragArea>
        <CardFloatArea>
          <div className="HBBoard">
            <div className="playHistoryWrapper">
              <HBPlayHistory/>
            </div>
            <div className="handsWrapper">
              <HBHandsArea perspective={0} />
            </div>
            <div className="clueHistoryWrapper">

            </div>
            <div className="discardWrapper">
              <HBDiscardPile/>
            </div>
            <div className="stackAreaWrapper">
              <HBStackArea />
            </div>
            <div className="stackClueAreaWrapper">
              <HBClueArea />
            </div>
            <div className="controlsPlaceHolder" />
          </div>
          <CardFloatLayer />
        </CardFloatArea>
      </DragArea>
    </GameUIContext.Provider >
  );
}
