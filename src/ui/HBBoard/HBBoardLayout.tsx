import { useEffect, useState } from "react";
import { FloatContext, FloatContextData } from "../util/Floating";
import { CardFloatLayer } from "./CardFloat/CardFloat";
import HBClueArea from "./ClueArea/ClueArea";
import { HBDeck } from "./Deck/Deck";
import HBDiscardPile from "./DiscardPile/DiscardPile";
import { HBHandsArea } from "./HandArea/Hand";
import HBPlayHistory from "./PlayHistory/PlayHistory";
import { HBReplayControls } from "./ReplayControls/ReplayControls";
import { HBScoreBoard } from "./ScoreBoard/ScoreBoard";
import { HBStackArea } from "./StackArea/Stack";
import { BoardContext } from "../BoardContext";
import Board from "../../client/Board";

import styles from "./BoardLayout.module.css";

export default function HBBoardLayout({ board }: { board: Board }) {
  const [floatData] = useState(() => new FloatContextData());
  useEffect(() => {
    floatData.init();
  });
  return (
    <BoardContext.Provider value={board}>
      <FloatContext.Provider value={floatData}>
        <div className={styles.Board}>
          <HBPlayHistory />
          <HBHandsArea />
          <HBDiscardPile />
          <HBStackArea />
          <HBReplayControls />
          <HBClueArea />
          <HBDeck />
          <HBScoreBoard />
        </div>
        <CardFloatLayer />
      </FloatContext.Provider>
    </BoardContext.Provider>
  );
}
