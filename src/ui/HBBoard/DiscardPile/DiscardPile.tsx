import React from "react";
import { Card } from "../../../game";
import { useZone, ZonePath } from "../../Zone";
import CardTarget from "../AnimatedDeck/CardTarget";
import { CardSVG } from "../../components/DrawCard";
import { useBoardStateSelector, useStaticBoardState } from "../../BoardContext";
import classNames from "../../util/classNames";
import { ErrorBoundary } from "../../util/ErrorBoundry";
import * as ArrayUtil from "../../../util/ArrayUtil";

import styles from "./DiscardPile.css";
import darkregion from "../DarkRegion.css";

const DiscardPileTargets = React.memo(function DiscardPileTargets() {
  const { deck, suits } = useStaticBoardState().variant;

  const sortedPile: Array<[number, Card]> = useBoardStateSelector(
    ((state) => {
      const entries = Array.from(state.viewTurn.discardPile.entries());
      const sortedPile = entries.sort((entryA, entryB) => {
        let [i, a] = entryA;
        let [j, b] = entryB;
        let cmp = deck.lookup[state.shuffleOrder[a]] - deck.lookup[state.shuffleOrder[b]];
        if (cmp == 0) {
          return i - j;
        }
        return cmp;
      });

      return sortedPile.map(([i, card]) => [i, deck.getCard(state.shuffleOrder[card])]);
    }),
    [deck],
    ArrayUtil.shallowCompare
  );

  let row = 0;
  let col = 0;
  let lastSuit = "";

  const discards: Map<string, [string, number]> = new Map();
  for (const [i, card] of sortedPile) {
    if (lastSuit != card.suit) {
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
      {ArrayUtil.iota(deck.length).map(i => {
        const card = deck.getCardByIndex(i);
        if (lastSuit != card.suit) {
          lastSuit = card.suit;
          row++;
          col = 0;
        }
        const key = `${card.suit}-${col++}`;
        const discard = discards.get(key);
        const style = {
          gridRow: `${(row * 2) + 1} / ${(row * 2) + 6}`,
          gridColumn: `${(col * 2) + 1} / ${(col * 2) + 6}`,
        };
        if (discard) {
          return (
            <CardTarget key={key} areaPath={discard} style={style} />
          );
        }
        return (
          <CardSVG key={key} style={style} />
        );
      })}
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
