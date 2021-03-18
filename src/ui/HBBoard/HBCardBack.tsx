import { ComponentProps } from "react";
import {OutlineFilter, CardDim} from "./CardUtil";
import { Vec2D, vecAdd, vecMul, vecSub } from "../util/Vector";
import { Pips } from "../../game/types/Empathy";
import colors from "../BaseColors";
import pipsIcons from "./pips";
import chroma from "chroma-js";


type HBCardBackProps = {
  suits: string[];
  pips: Pips;
} & ComponentProps<"svg">;

const { mid, viewBox } = CardDim;
const pipHeight = 17.5;
const pipOff = { x: - pipHeight / 2, y: - pipHeight / 2 };
const pipCenter = vecAdd(mid, pipOff);


export default function HBCardBack({ suits, pips, ...props }: HBCardBackProps) {
  let color = "#777777";
  let suitPips;
  //let numberPips;
  if (pips.suits.length === 1) {
    color = colors(pips.suits[0]);
    suitPips = [<image key={suits.findIndex((i) => i === pips.suits[0])} href={pipsIcons[pips.suits[0]]} height={20} {...pipCenter} filter="url(#outline)" />];
  } else {
    suitPips = suits.map((s, n) => {
      if (pips.suits.findIndex((i) => s === i) !== -1) {
        let angle = 2 * Math.PI * n / suits.length;
        let loc = vecAdd(pipCenter, vecMul({ x: -Math.sin(angle), y: -Math.cos(angle) }, 30));
        return (
          <image key={n} href={pipsIcons[s]} height={20} {...loc} filter="url(#outline)" />
        );
      } else {
        return undefined;
      }
    });
  }
  const backgroundColor = chroma.mix(color, "#FFFFFF", 0.5, "lrgb").hex();

  const numberPips = [1, 2, 3, 4, 5].map((n, i) => {
    if (pips.ranks.findIndex((i) => n === i) !== -1) {
      return (
        <text key={n} fill="white" fontSize="20px" x={13 + i * 18} y="135" filter="url(#outline)">{n}</text>
      );
    } else {
      return undefined;
    }
  });
  
  return (
    <svg className="HBCardBack" {...props} viewBox={viewBox}>
      {OutlineFilter}
      <rect x="5%" y="5%" width="90%" height="90%" fill={backgroundColor} rx="5%" />
      <rect x="5%" y="5%" width="90%" height="90%" fill="#00000000" strokeWidth="4%" stroke="#000000" rx="5%" />
      <rect x="5%" y="5%" width="90%" height="90%" fill="#00000000" strokeWidth="2.5%" stroke={color} rx="5%" />
      {suitPips}
      {numberPips}
    </svg>
  );
}
