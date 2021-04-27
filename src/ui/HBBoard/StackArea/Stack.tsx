import chroma from "chroma-js";

import CardTarget from "../AnimatedDeck/CardTarget";
import { useZone } from "../../Zone";
import { CARD_VIEW_MIDPOINT as mid } from "../../components/DrawCard";
import { vecAdd } from "../../../util/Geometry";
import { useStaticBoardState } from "../../BoardContext";

import colors from "../../BaseColors";
import { Pip } from "../../components/Pip";
import SuitPips from "../../SuitPips";

import styles from "./Stack.css";

type HBStackProps = {
  number: number;
  suit: string;
};

const pipHeight = 35;
const pipOff = { x: -pipHeight / 2, y: -pipHeight / 2 };
const pipDims = { ...vecAdd(mid, pipOff), size: pipHeight };

export function Stack({ suit, number }: HBStackProps) {
  const color = colors(suit);
  const backgroundColor = chroma
    .mix(color, "#FFFFFF", 0.3, "lrgb")
    .alpha(0.4)
    .hex();
  return (
    <CardTarget height="100%" width="100%" areaPath={["stacks", number]}>
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
      <Pip shape={SuitPips[suit]} {...pipDims} fill={color} />
    </CardTarget>
  );
}

export default function StackArea() {
  const { suits } = useStaticBoardState().variant;
  const ref = useZone(["stackArea"], { dropZone: true });
  return (
    <div ref={ref} className={styles.StackArea}>
      {suits.map((c, i) => (
        <Stack suit={c} key={i} number={i} />
      ))}
    </div>
  );
}
