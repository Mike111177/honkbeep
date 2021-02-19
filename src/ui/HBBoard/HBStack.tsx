import { useContext, useEffect, useState } from "react";

import { GameUIContext } from "../ReactFrontendInterface";
import HBCard from "./HBCard"
import colors from "../colors"

import "./HBStack.scss"

type HBStackProps = {
  number: number,
  suit: string
}

export default function HBStack({ suit, number }: HBStackProps) {
  const colorData = colors[suit];

  const context = useContext(GameUIContext);

  function getCurrentDisplayProps(): { empty: boolean, rank?: number } {
    const stack = context.getStack(number);
    if (stack.length === 0) {
      return { empty: true };
    } else {
      return { empty: false, rank: context.getCardDisplayableProps(stack[stack.length - 1]).rank };
    }
  }
  const [{ empty, rank }, setDisprops] = useState(getCurrentDisplayProps());
  context.useGameEvent("game-event", () => setDisprops(getCurrentDisplayProps()));

  if (empty) {
    return (
      <div className="HBStack" style={{ borderColor: colorData.fill, backgroundColor: colorData.back + "7f", color: colorData.fill }}>
        <img className="stackPip" src={colorData.pip} alt="" />
      </div>
    );
  } else {
    return (<HBCard rank={rank!} suit={suit} />);
  }
}
