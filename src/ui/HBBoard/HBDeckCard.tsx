import { useContext, useState } from "react";

import HBCardFront from "./HBCardFront"
import { GameUIContext } from "../ReactFrontendInterface";


export default function HBDeckCard({index}:any){
  const context = useContext(GameUIContext);
  const getCurrentDisplayProps = () => context.getCardDisplayableProps(index);
  const [cardInfo, setDisprops] = useState(getCurrentDisplayProps());
  context.useGameEvent("game-event", () => setDisprops(getCurrentDisplayProps()));
  return <HBCardFront {...cardInfo}/>

}
