import { useContext } from "react";
import chroma from "chroma-js";

import { CardTarget } from "../CardFloat/CardFloat";
import { useFloatArea } from "../../util/Floating";
import { CARD_VIEW_MIDPOINT as mid, OutlineFilter } from "../../Card";
import { vecAdd } from "../../../util/Vector";
import { BoardContext } from "../../BoardContext";

import colors from "../../BaseColors";
import pips from "../../pips";

import styles from "./Stack.module.css";

type HBStackProps = {
  number: number;
  suit: string;
};

const pipHeight = 35;
const pipOff = { x: -pipHeight / 2, y: -pipHeight / 2 };
const pipCenter = vecAdd(mid, pipOff);

export function HBStack({ suit, number }: HBStackProps) {
  const color = colors(suit);
  const backgroundColor = chroma
    .mix(color, "#FFFFFF", 0.3, "lrgb")
    .alpha(0.4)
    .hex();
  return (
    <CardTarget height="100%" width="100%" areaPath={["stacks", number]}>
      {OutlineFilter}
      <rect
        x="5%"
        y="5%"
        width="90%"
        height="90%"
        fill={backgroundColor}
        rx="5%"
      />
      <rect
        x="5%"
        y="5%"
        width="90%"
        height="90%"
        fill="#00000000"
        strokeWidth="4%"
        stroke="#000000"
        rx="5%"
      />
      <rect
        x="5%"
        y="5%"
        width="90%"
        height="90%"
        fill="#00000000"
        strokeWidth="2.5%"
        stroke={color}
        rx="5%"
      />
      <image
        href={pips[suit]}
        height={pipHeight}
        {...pipCenter}
        {...pipCenter}
        filter="url(#outline)"
      />
    </CardTarget>
  );
}

export function HBStackArea() {
  const context = useContext(BoardContext);
  const suits = context.boardState.definition.variant.suits;
  const ref = useFloatArea(["stackArea"], { dropZone: true });
  return (
    <div ref={ref} className={styles.StackArea}>
      {suits.map((c, i) => (
        <HBStack suit={c} key={i} number={i} />
      ))}
    </div>
  );
}
