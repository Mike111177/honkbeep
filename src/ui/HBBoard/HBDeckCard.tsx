import { useContext, useEffect, useMemo, useState } from "react";

import HBCardFront from "./HBCardFront";
import { GameUIContext, useClientLatestState } from "./ClientGameStateManager";
import HBCardBack from "./HBCardBack";

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
  const latestState = useClientLatestState();
  const empathy = latestState.empathy[index];
  const suits = latestState.game.definition.variant.suits;
  const shuffleOrder = latestState.shuffleOrder;
  const pips = useMemo(() => context.getPips(empathy), [context, empathy]);
  const deck = latestState.game.deck;
  const cardInfo = useMemo(() => {
    const card = shuffleOrder[index];
    if (card !== undefined) {
      return deck.getCard(card);
    } else {
      return undefined;
    }
  }, [deck, index, shuffleOrder]);

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
