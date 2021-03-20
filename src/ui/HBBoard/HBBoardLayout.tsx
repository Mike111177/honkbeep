import { useEffect, useState } from "react";
import { FloatContext, FloatContextData } from "../util/Floating";
import { CardFloatLayer } from "./subcomponents/CardFloat";
import HBClueArea from "./subcomponents/HBClueArea";
import { HBDeck } from "./subcomponents/HBDeck";
import HBDiscardPile from "./subcomponents/HBDiscardPile";
import { HBHandsArea } from "./subcomponents/HBHand";
import HBPlayHistory from "./subcomponents/HBPlayHistory";
import { HBReplayControls } from "./subcomponents/HBReplayControls";
import { HBScoreBoard } from "./subcomponents/HBScoreBoard";
import { HBStackArea } from "./subcomponents/HBStack";
import { Board, BoardContext } from "./types/BoardContext";

import "./HBBoardLayout.scss";

export default function HBBoardLayout({ board }: { board: Board }) {
  const [floatData] = useState(() => new FloatContextData());
  useEffect(() => {
    floatData.init();
  });
  return (
    <BoardContext.Provider value={board}>
      <FloatContext.Provider value={floatData}>
        <div className="HBBoard">
          <div className="playHistoryWrapper">
            <HBPlayHistory />
          </div>
          <div className="handsWrapper">
            <HBHandsArea perspective={0} />
          </div>
          <div className="clueHistoryWrapper"></div>
          <div className="discardWrapper">
            <HBDiscardPile />
          </div>
          <div className="stackAreaWrapper">
            <HBStackArea />
          </div>
          <div className="stackClueAreaWrapper">
            <HBClueArea />
            <HBReplayControls />
          </div>
          <div className="controlsPlaceHolder">
            <HBDeck />
            <HBScoreBoard />
          </div>
        </div>
        <CardFloatLayer />
      </FloatContext.Provider>
    </BoardContext.Provider>
  );
}
