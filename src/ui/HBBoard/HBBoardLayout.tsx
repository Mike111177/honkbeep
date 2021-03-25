import { useEffect, useState } from "react";
import { FloatContext, FloatContextData } from "../util/Floating";
import AnimatedDeck from "./AnimatedDeck/AnimatedDeck";
import ClueArea from "./ClueArea/ClueArea";
import Deck from "./Deck/Deck";
import DiscardPile from "./DiscardPile/DiscardPile";
import HandsArea from "./HandArea/HandArea";
import PlayHistory from "./PlayHistory/PlayHistory";
import ReplayControls from "./ReplayControls/ReplayControls";
import ScoreBoard from "./ScoreBoard/ScoreBoard";
import StackArea from "./StackArea/Stack";
import BoardContext from "../BoardContext";
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
          <PlayHistory />
          <HandsArea />
          <DiscardPile />
          <StackArea />
          <ReplayControls />
          <ClueArea />
          <Deck />
          <ScoreBoard />
          <AnimatedDeck />
        </div>
      </FloatContext.Provider>
    </BoardContext.Provider>
  );
}
