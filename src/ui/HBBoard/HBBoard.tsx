import HBClueArea from "./HBClueArea";
import { HBStackArea } from "./HBStack";
import HBDiscardPile from "./HBDiscardPile";
import { DragArea } from "../util/Dragging";
import { CardFloatLayer, CardFloatArea } from "./CardFloat";
import { HBHandsArea } from "./HBHand";
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
            <div className="HBPlayHistory">
            </div>
            <div className="handsWrapper">
              <HBHandsArea perspective={0} />
            </div>
            <div className="clueHistoryWrapper"/>
            <div className="discardWrapper">
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
  );
}
