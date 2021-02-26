import { useContext, useEffect, useState } from "react";

import { CardFloatTarget } from "./CardFloat";
import { GameUIContext } from "../ReactFrontendInterface";
import { DropZone } from "../util/Dragging";

import colors from "../colors";
import pips from "./pips";
import "./HBStackArea.scss";
import "./HBStack.scss";

type HBStackProps = {
  number: number;
  suit: string;
}

export function HBStack({ suit, number }: HBStackProps) {
  const colorData = colors[suit];

  const context = useContext(GameUIContext);

  function getCurrentCard(): number | undefined {
    const stack = context.getStack(number);
    return stack[stack.length - 1];
  }
  const [index, setIndex] = useState(getCurrentCard());
  useEffect(() => {
    const callback = () => {
      setIndex(getCurrentCard());
    };
    const removeFunc = () => {context.off("game-update", callback)};
    context.on("game-update", callback);
    return removeFunc;
  });
  return (
    <div>
      <CardFloatTarget index={index} style={{ width: "0", height: "0" }} />
      <div className="HBStack" style={{ borderColor: colorData.fill, backgroundColor: colorData.back + "7f", color: colorData.fill }}>
        <img className="stackPip" src={pips[suit]} alt="" />
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
  );
}
