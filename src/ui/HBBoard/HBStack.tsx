import { useContext, useState } from "react";

import { GameUIContext } from "../ReactFrontendInterface";
import { DropZone } from "./Dragging";
import HBDeckCard from "./HBDeckCard"

import colors from "../colors"
import "./HBStackArea.scss"
import "./HBStack.scss"
import { CardFloatTarget } from "./CardFloat";

type HBStackProps = {
  number: number,
  suit: string
}

export function HBStack({ suit, number }: HBStackProps) {
  const colorData = colors[suit];

  const context = useContext(GameUIContext);

  function getCurrentCard(): number | undefined {
    const stack = context.getStack(number);
    return stack[stack.length - 1];
  }
  const [index, setIndex] = useState(getCurrentCard());
  context.useGameEvent("game-event", () => {
    setIndex(getCurrentCard())
  });

  return (
    <div>
      <CardFloatTarget index={index} style={{ width: "0", heigt: "0" }} />
      <div className="HBStack" style={{ borderColor: colorData.fill, backgroundColor: colorData.back + "7f", color: colorData.fill }}>
        <img className="stackPip" src={colorData.pip} alt="" />
      </div>
    </div>
  );
}

export function HBStackArea() {
  const suits = useContext(GameUIContext).getSuits();
  return (
    <DropZone id="stacks" className="HBStackArea" style={{ gridTemplateColumns: `repeat(${suits.length}, auto)` }}>
      {suits.map((c, i) => <HBStack suit={c} key={i} number={i} />)}
    </DropZone>
  )
}
