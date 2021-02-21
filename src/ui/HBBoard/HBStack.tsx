import { useContext, useState } from "react";

import { GameUIContext } from "../ReactFrontendInterface";
import HBDeckCard from "./HBDeckCard"
import colors from "../colors"

import "./HBStack.scss"

type HBStackProps = {
  number: number,
  suit: string
}

export default function HBStack({ suit, number }: HBStackProps) {
  const colorData = colors[suit];

  const context = useContext(GameUIContext);

  function getCurrentCard(): number | undefined {
    const stack = context.getStack(number);
    return stack[stack.length - 1];
  }
  const [index, setIndex] = useState(getCurrentCard());
  context.useGameEvent("game-event", () => setIndex(getCurrentCard()));

  if (index===undefined) {
    return (
      <div className="HBStack" style={{ borderColor: colorData.fill, backgroundColor: colorData.back + "7f", color: colorData.fill }}>
        <img className="stackPip" src={colorData.pip} alt="" />
      </div>
    );
  } else {
    return (<HBDeckCard index={index}/>);
  }
}
