import { useContext, useEffect, useMemo, useState } from "react";

import HBCardFront from "./HBCardFront";
import { GameUIContext } from "./ClientGameStateManager";
import HBCardBack from "./HBCardBack";

//TODO: PLS REMOVE, REPLACE WITH BETTER THING
let spaceIsDown = false;
const listeners: ((sd:boolean)=>void)[] = [];
window.addEventListener("keydown", (event) => {
  if (event.code === "Space" && spaceIsDown === false) {
    spaceIsDown = true;
    listeners.forEach(i => i(spaceIsDown));
  }
});
window.addEventListener("keyup", (event) => {
  if (event.code === "Space" && spaceIsDown === true) {
    spaceIsDown = false;
    listeners.forEach(i => i(spaceIsDown));
  }
});

export default function HBDeckCard({ index, ...props }: any) {
  const context = useContext(GameUIContext);
  const [latestState, setLatestState] = useState(() => context.getLatestState());
  const [spaceDown, setSpaceDown] = useState(spaceIsDown);
 
  useEffect(() => context.subscribeToStateChange(() => {
    setLatestState(context.getLatestState());
  }), [context, index]);

  useEffect(() => {
    listeners.push(setSpaceDown);
    return () => { listeners.splice(listeners.findIndex(i => i === setSpaceDown), 1) };
  }, []);

  const empathy = latestState.empathy[index];
  
  const pips = useMemo(() => {
    return context.getPips(empathy);
  }, [context, empathy]);

  if (context.isCardRevealed(index) && !spaceDown) {
    let cardInfo = context.getCardDisplayableProps(index);
    return <HBCardFront {...cardInfo} {...props} />;
  } else {
    return <HBCardBack suits={context.getSuits()} pips={pips} {...props}  />;
  }
}
