import React, { useState, useMemo } from "react";
import { CardFace } from "../../../game";
import { useZone, ZonePath } from "../../Zone";
import CardTarget from "../AnimatedDeck/CardTarget";
import { CardSVG } from "../../components/DrawCard";
import { useBoardStateUpdates } from "../../BoardContext";
import classNames from "../../util/classNames";
import { ErrorBoundary } from "../../util/ErrorBoundry";
import * as ArrayUtil from "../../../util/ArrayUtil";
import { useBoard } from "../../BoardContext/hooks/useBoard";

import styles from "./DiscardPile.css";
import darkregion from "../DarkRegion.css";

type DiscardTargetProps = {
  row: number;
  col: number;
  discard: ZonePath | undefined;
  z: number;
};

const DiscardTarget = React.memo(function DiscardTarget({
  row,
  col,
  discard,
  z,
}: DiscardTargetProps) {
  const style = {
    gridRow: `${row * 2 + 1} / ${row * 2 + 6}`,
    gridColumn: `${col * 2 + 1} / ${col * 2 + 6}`,
  };
  if (discard) {
    return (
      <CardTarget areaPath={discard} style={style} config={{ meta: { z } }} />
    );
  }
  return <CardSVG style={style} />;
});

const DiscardPileTargets = React.memo(function DiscardPileTargets() {
  const _ = useBoard().state;
  const { deck } = _.variant;

  const [discardPile, setDiscardPile] = useState(() => _.viewTurn.discardPile);
  const [discardIndices, setDiscardIndicies] = useState(() =>
    discardPile.map((i) => _.shuffleOrder[i])
  );

  useBoardStateUpdates(
    ({ shuffleOrder, viewTurn }) => {
      if (viewTurn.discardPile !== discardPile) {
        setDiscardPile(viewTurn.discardPile);
        setDiscardIndicies(viewTurn.discardPile.map((i) => shuffleOrder[i]));
      }
    },
    [discardPile]
  );

  const { sortedPile, zIndices } = useMemo(() => {
    const sorted = Array.from(discardPile.entries()).sort(
      ([i], [j]) => discardIndices[i] - discardIndices[j] || i - j
    );

    const zIndices = new Map();
    for (const [z, [i]] of sorted.entries()) {
      zIndices.set(i, z);
    }

    const sortedPile: Array<[number, CardFace]> = sorted.map(([i, card]) => [
      i,
      deck.getFaceByCardIndex(_.shuffleOrder[card]),
    ]);

    return { sortedPile, zIndices };
  }, [_.shuffleOrder, deck, discardIndices, discardPile]);

  let row = 0;
  let col = 0;
  let lastSuit = "";

  const discards: Map<string, [string, number]> = new Map();
  for (const [i, card] of sortedPile) {
    if (lastSuit !== card.suit) {
      lastSuit = card.suit;
      col = 0;
    }
    const key = `${card.suit}-${col++}`;
    discards.set(key, ["discard", i]);
  }

  row = 0;
  col = 0;
  lastSuit = "";
  return (
    <>
      {ArrayUtil.iota(deck.length).map((i) => {
        const card = deck.getFaceByCardIndex(i);
        if (lastSuit !== card.suit) {
          lastSuit = card.suit;
          row++;
          col = 0;
        }
        const key = `${card.suit}-${col++}`;
        const discard = discards.get(key);
        const z = discard ? zIndices.get(discard[1]) : -10;
        return (
          <DiscardTarget
            key={key}
            row={row}
            col={col}
            discard={discard}
            z={z}
          />
        );
      })}
    </>
  );
});

const discardPilePath: ZonePath = ["discardPile"];
const discardPileConfig = { attributes: ["dropzone"] };
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
