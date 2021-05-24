import { mix } from "chroma-js";

import CardTarget from "../AnimatedDeck/CardTarget";
import { useZone } from "react-zones";
import { CARD_VIEW_MIDPOINT as mid } from "../../components/DrawCard";
import { vecAdd } from "honkbeep-util";
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
  const backgroundColor = mix(color, "#FFFFFF", 0.3, "lrgb").alpha(0.4).hex();
  return (
    <CardTarget areaPath={["stacks", number]}>
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

const stackAreaZonePath = "stackArea";
const stackAreaZoneConfig = { attributes: ["dropzone"] };

export default function StackArea() {
  const { suits } = useStaticBoardState().variant;
  const ref = useZone(stackAreaZonePath, stackAreaZoneConfig);
  return (
    <div ref={ref} className={styles.StackArea}>
      {suits.map((c, i) => (
        <Stack suit={c} key={i} number={i} />
      ))}
    </div>
  );
}
