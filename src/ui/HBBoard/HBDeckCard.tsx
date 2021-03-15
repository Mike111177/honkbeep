import { useContext } from "react";

import HBCardFront from "./HBCardFront";
import { GameUIContext } from "../ReactFrontendInterface";
import HBCardBack from "./HBCardBack";


export default function HBDeckCard({ index, ...props }: any) {
  const context = useContext(GameUIContext);
  if (context.isCardRevealed(index)) {
    let cardInfo = context.getCardDisplayableProps(index);
    return <HBCardFront {...cardInfo} {...props} />;
  } else {
    return <HBCardBack suits={context.getSuits()} {...props}  />;
  }
}
