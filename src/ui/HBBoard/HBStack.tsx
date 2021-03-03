import { useContext, useEffect, useState } from "react";
import chroma from "chroma-js";

import { CardFloatTarget } from "./CardFloat";
import { GameUIContext } from "../ReactFrontendInterface";
import { DropZone } from "../util/Dragging";
import { CardDim, OutlineFilter } from "./CardUtil";
import { vecAdd } from "../util/Vector";

import colors from "../BaseColors";
import pips from "./pips";
import "./HBStack.scss";



type HBStackProps = {
  number: number;
  suit: string;
}

const { mid, viewBox } = CardDim;
const pipHeight = 35;
const pipOff = { x: - pipHeight / 2, y: - pipHeight / 2 };
const pipCenter = vecAdd(mid, pipOff);

export function HBStack({ suit, number }: HBStackProps) {
  const color = colors(suit);

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
    const removeFunc = () => { context.off("game-update", callback) };
    context.on("game-update", callback);
    return removeFunc;
  });
  const backgroundColor = chroma.mix(color,"#FFFFFF", 0.3, "lrgb").alpha(0.4).hex();
  return (
    <CardFloatTarget index={index}>
      <svg height="200" viewBox={viewBox}>
        {OutlineFilter}
        <rect x="5%" y="5%" width="90%" height="90%" fill={backgroundColor} rx="5%" />
        <rect x="5%" y="5%" width="90%" height="90%" fill="#00000000" strokeWidth="4%" stroke="#000000" rx="5%" />
         <rect x="5%" y="5%" width="90%" height="90%" fill="#00000000" strokeWidth="2.5%" stroke={color} rx="5%" />
        <image href={pips[suit]} height={pipHeight} {...pipCenter} {...pipCenter} filter="url(#outline)" />
      </svg>
    </CardFloatTarget>
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
