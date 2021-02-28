import { useContext, useEffect, useState } from "react";

import HBCardFront from "./HBCardFront";
import { GameUIContext } from "../ReactFrontendInterface";
import HBCardBack from "./HBCardBack";


export default function HBDeckCard({ index }: any) {
  const context = useContext(GameUIContext);
  if (context.isCardRevealed(index)) {
    let cardInfo = context.getCardDisplayableProps(index);
    return <HBCardFront style={{ userSelect: "none" }} {...cardInfo} />;
  } else {
    return <HBCardBack style={{ userSelect: "none" }} suits={context.getSuits()} />;
  }
}
