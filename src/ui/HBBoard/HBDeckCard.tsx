import { useContext, useEffect, useState } from "react";

import HBCardFront from "./HBCardFront";
import { GameUIContext } from "../ReactFrontendInterface";


export default function HBDeckCard({ index }: any) {
  const context = useContext(GameUIContext);
  const getCurrentDisplayProps = () => context.getCardDisplayableProps(index);
  const [cardInfo, setDisprops] = useState(getCurrentDisplayProps());
  useEffect(() => {
    const callback = () => setDisprops(getCurrentDisplayProps());
    const removeFunc = () => { context.off("game-update", callback) };
    context.on("game-update", callback);
    return removeFunc;
  });
  return <HBCardFront height="150" width="110" style={{ margin: "2.5px", userSelect: "none" }} {...cardInfo} />;

}
