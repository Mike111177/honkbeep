import React from "react";
import { useZone, ZonePath } from "../../Zone";
import CardTarget from "../AnimatedDeck/CardTarget";
import { useBoardStateSelector, useStaticBoardState } from "../../BoardContext";
import classNames from "../../util/classNames";
import { ErrorBoundary } from "../../util/ErrorBoundry";
import * as ArrayUtil from "../../../util/ArrayUtil";

import styles from "./DiscardPile.css";
import darkregion from "../DarkRegion.css";

const DiscardPileTargets = React.memo(function DiscardPileTargets() {
  const { deck, suits } = useStaticBoardState().variant;
  const cards = useBoardStateSelector(
    (s) =>
      s.viewTurn.discardPile.map((card) => deck.getCard(s.shuffleOrder[card])),
    [deck],
    ArrayUtil.shallowCompare
  );
  const suitsPresent = suits.filter(
    (s) => cards.find((c) => c.suit === s) !== undefined
  );
  return (
    <>
      {cards.map((card, i) => (
        <CardTarget
          key={i}
          areaPath={["discard", i]}
          style={{
            gridColumn: suitsPresent.findIndex((s) => s === card.suit) + 1,
          }}
        />
      ))}
    </>
  );
});

const discardPilePath: ZonePath = ["discardPile"];
const discardPileConfig = { dropZone: true };
const discardPileClass = classNames(styles.DiscardPile, darkregion.DarkRegion);

export default function DiscardPile() {
  return (
    <div
      className={discardPileClass}
      ref={useZone(discardPilePath, discardPileConfig)}
    >
      <ErrorBoundary>
        <DiscardPileTargets />
      </ErrorBoundary>
    </div>
  );
}
