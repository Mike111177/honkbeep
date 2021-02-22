import React, { useContext, useState } from "react";

import { GameUIContext } from "../ReactFrontendInterface";
import { CardFloatTarget } from "./CardFloat";
import { DropZone } from "./Dragging";

export default function HBDiscardPile() {
  const context = useContext(GameUIContext);
  const [cards, setCards] = useState(context.getDiscardPile());
  context.useGameEvent("game-event", () => setCards(context.getDiscardPile()));
  
  //TODO: Fix this..........
  const cardOrder = cards
    .map(index=>({index, ...context.getCardDisplayableProps(index)}))
    .sort((a,b)=>(a.suit < b.suit ? -1 : a.suit > b.suit ? 1 : a.rank - b.rank))
    .map(i=>i.index);
  return (
    <DropZone id="discard" style={{
      width:"70%", 
      height:"100%", 
      display:"flex", 
      flexDirection:"row",
      justifyContent: "space-evenly",
      alignContent: "center",
      flexWrap: " wrap"}}>
      {cardOrder.map(i=><CardFloatTarget style={{minWidth: "80px", height: "162px"}} key={i} index={i} />)}
    </DropZone>
  )
}
