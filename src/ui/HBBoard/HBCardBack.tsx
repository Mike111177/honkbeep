import { ComponentProps } from "react";
import { Vec2D, vecAdd, vecMul, vecSub } from "../util/Vector";

import pips from "./pips";

type HBCardBackProps = {
  suits: string[];
} & ComponentProps<"svg">;


const view = { x: 110, y: 150 };
const pipHeight = 17.5;

const viewBox = `0 0 ${view.x} ${view.y}`;
const mid = vecMul(view, 0.5);
const pipOff = { x: - pipHeight / 2, y: - pipHeight / 2 };
const pipCenter = vecAdd(mid, pipOff);


export default function HBCardBack({ suits, ...props }: HBCardBackProps) {

  return (
    <svg {...props} viewBox={viewBox}>
      <defs>
        <filter id="outline">
          <feComponentTransfer>
            <feFuncR type="linear" slope="0" />
            <feFuncG type="linear" slope="0" />
            <feFuncB type="linear" slope="0" />
          </feComponentTransfer>
          <feMorphology operator="dilate" radius="1" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="5%" y="5%" width="90%" height="90%" fill="#cccccc" strokeWidth="2.5%" stroke="#777777" rx="5%" />
      {
        suits.map((s, n) => {
          let angle = 2 * Math.PI * n / suits.length;
          let loc = vecAdd(pipCenter, vecMul({ x: -Math.sin(angle), y: -Math.cos(angle) }, 30));
          return (
            <image key={n} href={pips[s]} height={20} {...loc} filter="url(#outline)"/>
          );
        })
      }
      {
        [1, 2, 3, 4, 5].map((n, i) => {
          return (
            <text key={n} fill="white" fontSize="20px" x={13+i*18} y="135" filter="url(#outline)">{n}</text>
          );
        })
      }
    </svg>
  );
}
