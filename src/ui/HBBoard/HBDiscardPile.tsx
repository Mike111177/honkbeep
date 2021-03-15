import { useContext, useEffect, useState } from "react";

import { GameUIContext } from "../ReactFrontendInterface";
import { FloatArea, useFloatArea } from "../util/Floating";

export default function HBDiscardPile() {
  const context = useContext(GameUIContext);
  const [cards, setCards] = useState(context.getDiscardPile());
  useEffect(() => {
    const callback = () => {
      const newCards = context.getDiscardPile();
      if (newCards.length !== cards.length) {
        setCards(newCards);
      }
    };
    const removeFunc = () => {context.off("game-update", callback)};
    context.on("game-update", callback);
    return removeFunc;
  });

  const ref = useFloatArea(["discardPile"], { dropZone: true });
  
  //TODO: Fix this..........
  const cardOrder = cards
    .map(index=>({index, ...context.getCardDisplayableProps(index)}))
    .sort((a,b)=>(a.suit < b.suit ? -1 : a.suit > b.suit ? 1 : a.rank - b.rank))
    .map(i=>i.index);
  return (
    <div ref={ref} id="discard" style={{
      width: "100%",
      height: "100%",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      justifyContent: "space-evenly",
      alignContent: "center"
    }}>
      {cardOrder.map(i => <FloatArea style={{ minWidth: "80px", height: "162px" }} key={i} areaPath={["discard", i]} />)}
    </div>
  );
}
