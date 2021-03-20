import { useContext, useEffect, useMemo, useState } from "react";

import HBCardFront from "./HBCardFront";
import { GameUIContext } from "./ClientState";
import HBCardBack from "./HBCardBack";
import { getPipsFromEmpathy } from "../../game/types/Empathy";

//TODO: PLS REMOVE, REPLACE WITH BETTER THING
let spaceIsDown = false;
const listeners: ((sd: boolean) => void)[] = [];
window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && spaceIsDown === false) {
    spaceIsDown = true;
    listeners.forEach((i) => i(spaceIsDown));
  }
});
window.addEventListener("keyup", (event) => {
  if (event.code === "Space" && spaceIsDown === true) {
    spaceIsDown = false;
    listeners.forEach((i) => i(spaceIsDown));
  }
});

export default function HBDeckCard({ index, ...props }: any) {
  const context = useContext(GameUIContext);
  const [empathy, latestGame, card] = context.useBoardState((boardState) => {
    return [
      boardState.latestTurn.empathy[index],
      boardState.latestTurn.game,
      boardState.shuffleOrder[index],
    ];
  });
  const suits = latestGame.definition.variant.suits;
  const deck = latestGame.deck;
  const pips = useMemo(() => getPipsFromEmpathy(empathy, latestGame), [
    empathy,
    latestGame,
  ]);
  const cardInfo = useMemo(() => {
    if (card !== undefined) {
      return deck.getCard(card);
    } else {
      return undefined;
    }
  }, [deck, card]);

  const [spaceDown, setSpaceDown] = useState(spaceIsDown);
  useEffect(() => {
    listeners.push(setSpaceDown);
    return () => {
      listeners.splice(
        listeners.findIndex((i) => i === setSpaceDown),
        1
      );
    };
  }, []);

  if (cardInfo !== undefined && !spaceDown) {
    return <HBCardFront {...cardInfo} {...props} />;
  } else {
    return <HBCardBack suits={suits} pips={pips} {...props} />;
  }
}
