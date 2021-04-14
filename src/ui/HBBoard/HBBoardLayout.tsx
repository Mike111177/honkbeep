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
import { FacilityBoundary } from "../Zone";

import styles from "./BoardLayout.css";

export default function HBBoardLayout({ board }: { board: Board }) {
  return (
    <BoardContext.Provider value={board}>
      <FacilityBoundary>
        <div className={styles.Board}>
          <div className={styles.BoardGrid}>
            <PlayHistory />
            <HandsArea />
            <DiscardPile />
            <StackArea />
            <ReplayControls />
            <ClueArea />
            <Deck />
            <ScoreBoard />
          </div>
          <AnimatedDeck />
        </div>
      </FacilityBoundary>
    </BoardContext.Provider>
  );
}
