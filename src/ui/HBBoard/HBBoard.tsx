import { useEffect, useState } from "react";
import HBClueArea from "./HBClueArea";
import { HBStackArea } from "./HBStack";
import HBDiscardPile from "./HBDiscardPile";
import { FloatContext, FloatContextData } from "../util/Floating";
import { CardFloatLayer, CardTarget } from "./CardFloat";
import { HBHandsArea } from "./HBHand";
import HBPlayHistory from "./HBPlayHistory";
import ReactUIInterface, { GameUIContext } from '../ReactFrontendInterface';

import './HBBoard.scss';



type HBBoardProps = {
  game: ReactUIInterface;
}

export default function HBBoard({ game }: HBBoardProps) {
  const [floatData] = useState(() => new FloatContextData());
  useEffect(() => {
    floatData.init();
  });
  return (
    <GameUIContext.Provider value={game}>
      <FloatContext.Provider value={floatData}>
        <div className="HBBoard">
          <div className="playHistoryWrapper">
            <HBPlayHistory />
          </div>
          <div className="handsWrapper">
            <HBHandsArea perspective={0} />
          </div>
          <div className="clueHistoryWrapper">

          </div>
          <div className="discardWrapper">
            <HBDiscardPile />
          </div>
          <div className="stackAreaWrapper">
            <HBStackArea />
          </div>
          <div className="stackClueAreaWrapper">
            <HBClueArea />
          </div>
          <div className="controlsPlaceHolder" style={{ display: "flex", flexDirection: "row-reverse" }}>
            <CardTarget areaPath={["deck"]}/>
          </div>
        </div>
        <CardFloatLayer />
      </FloatContext.Provider>
    </GameUIContext.Provider >
  );
}
