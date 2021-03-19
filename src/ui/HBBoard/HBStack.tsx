import chroma from "chroma-js";

import { CardTarget } from "./CardFloat";
import { useClientViewState } from "./ClientGameStateManager";
import { useFloatArea } from "../util/Floating";
import { CardDim, OutlineFilter } from "./CardUtil";
import { vecAdd } from "../util/Vector";

import colors from "../BaseColors";
import pips from "./pips";
import "./HBStack.scss";

type HBStackProps = {
  number: number;
  suit: string;
}

const { mid } = CardDim;
const pipHeight = 35;
const pipOff = { x: - pipHeight / 2, y: - pipHeight / 2 };
const pipCenter = vecAdd(mid, pipOff);

export function HBStack({ suit, number }: HBStackProps) {
  const color = colors(suit);
  const backgroundColor = chroma.mix(color, "#FFFFFF", 0.3, "lrgb").alpha(0.4).hex();
  return (
    <CardTarget height="100%" width="100%" areaPath={["stacks", number]}>
      {OutlineFilter}
      <rect x="5%" y="5%" width="90%" height="90%" fill={backgroundColor} rx="5%" />
      <rect x="5%" y="5%" width="90%" height="90%" fill="#00000000" strokeWidth="4%" stroke="#000000" rx="5%" />
      <rect x="5%" y="5%" width="90%" height="90%" fill="#00000000" strokeWidth="2.5%" stroke={color} rx="5%" />
      <image href={pips[suit]} height={pipHeight} {...pipCenter} {...pipCenter} filter="url(#outline)" />
    </CardTarget>
  );
}

export function HBStackArea() {
  const suits = useClientViewState().game.definition.variant.suits;
  const ref = useFloatArea(["stackArea"], {dropZone: true});
  return (
    <div ref={ref} id="stacks" className="HBStackArea">
      {suits.map((c, i) => <HBStack suit={c} key={i} number={i} />)}
    </div>
  );
}
