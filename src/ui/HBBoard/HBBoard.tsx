import { useEffect, useState } from "react";
import HBClueArea from "./HBClueArea";
import { HBStackArea } from "./HBStack";
import HBDiscardPile from "./HBDiscardPile";
import { FloatContext, FloatContextData } from "../util/Floating";
import { CardFloatLayer } from "./CardFloat";
import { HBHandsArea } from "./HBHand";
import HBPlayHistory from "./HBPlayHistory";
import ClientStateManager, { GameUIContext } from "./ClientGameStateManager";
import { HBDeck } from "./HBDeck";

import "./HBBoard.scss";
import { HBScoreBoard } from "./HBScoreBoard";
import { HBReplayControls } from "./HBReplayControls";
import BackendInterface from "../../game/BackendInterface";

type HBBoardProps = {
  backend: BackendInterface;
};

export default function HBBoard({ backend }: HBBoardProps) {
  //State to wait for
  const [manager, setManager] = useState<undefined | ClientStateManager>(
    undefined
  );

  useEffect(() => {
    backend.onReady(() => setManager(new ClientStateManager(backend)));
  }, [backend]);

  const [floatData] = useState(() => new FloatContextData());
  useEffect(() => {
    floatData.init();
  });

  if (manager !== undefined) {
    return (
      <GameUIContext.Provider value={manager}>
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
            </div>
            <div
              className="controlsPlaceHolder"
              style={{ display: "flex", flexDirection: "row-reverse" }}
            >
              <HBDeck />
              <HBScoreBoard />
              <div>
                Debug Controls:
                <HBReplayControls />
                <div>
                  <button
                    onClick={() => {
                      (window as any).HONKPlayRandom();
                    }}
                  >
                    Try Play Random Card
                  </button>
                </div>
              </div>
            </div>
          </div>
          <CardFloatLayer />
        </FloatContext.Provider>
      </GameUIContext.Provider>
    );
  } else {
    return <span>Waiting for initialization.</span>;
  }
}
