import { useContext, useEffect, useState } from "react";

import HBCardFront from "./HBCardFront";
import { GameUIContext } from "../ReactFrontendInterface";
import HBCardBack from "./HBCardBack";


export default function HBDeckCard({ index }: any) {
  const context = useContext(GameUIContext);
  if (context.isCardRevealed(index)) {
    let cardInfo = context.getCardDisplayableProps(index);
    return <HBCardFront height="150" style={{ margin: "2.5px", userSelect: "none" }} {...cardInfo} />;
  } else {
    return <HBCardBack height="150" style={{ margin: "2.5px", userSelect: "none" }} suits={context.getSuits()} />;
  }
}
