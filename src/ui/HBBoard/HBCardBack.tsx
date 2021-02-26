import { ComponentProps } from "react";
import { Vec2D, vecAdd, vecMul } from "../util/Vector";

import pips from "./pips";

type HBCardBackProps = {
  suits: string[];
} & ComponentProps<"svg">;

export default function HBCardBack({ suits, ...props }: HBCardBackProps) {

  return (
    <svg {...props} viewBox="0 0 110 150">
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
          let center: Vec2D = { x: 45, y: 60 };
          let angle = 2 * Math.PI * n / suits.length;
          let { x, y } = vecAdd(center, vecMul({ x: Math.sin(angle), y: -Math.cos(angle) }, 30));
          return (
            <image key={n} href={pips[s]} height={20} x={x} y={y} filter="url(#outline)" />
          );
        })
      }
      {
        [1, 2, 3, 4, 5].map((n, i) => {
          return (
            <text key={n} fill="white" fontSize="20px" x={13+i*18} y={135} filter="url(#outline)">{n}</text>
          );
        })
      }
    </svg>
  );
}
