import "./HBCard.scss";
import colors from "../../BaseColors";
import pips from "../pips";
import { ComponentProps } from "react";
import { vecAdd, vecSub } from "../../util/Vector";
import { OutlineFilter, CardDim } from "./CardUtil";
import chroma from "chroma-js";

export type HBCardProps = {
  rank: number;
  suit: string;
} & ComponentProps<"svg">;

//Tweakables
const rPipHeight = 17.5;
const cPipHeight = 27.5;
const pipDist = { x: 30, y: 35 };
const numOffset = { x: 25, y: 30 };
const numSize = 50;

//Calculated Constants
const { mid, viewBox } = CardDim;

const pipCorner = vecSub(mid, pipDist);

const rPipOff = { x: -rPipHeight / 2, y: -rPipHeight / 2 };
const cPipOff = { x: -cPipHeight / 2, y: -cPipHeight / 2 };

const pipFlip = `rotate(180 ${mid.x} ${mid.y})`;

const pipT = vecAdd({ x: mid.x, y: pipCorner.y }, rPipOff);
const pipR = vecAdd({ x: pipCorner.x, y: mid.y }, rPipOff);
const pipC = vecAdd(mid, cPipOff);

//For rendering frontface of absolutley known card
//TODO: It might be a good idea to add a pre-render step for all of the possible card faces
export default function HBCardFront({ suit, rank, ...props }: HBCardProps) {
  let color = colors(suit);
  let pip = pips[suit];
  const num = rank;
  const backgroundColor = chroma.mix(color, "#FFFFFF", 0.5, "lrgb").hex();
  return (
    <svg className="HBCardFront" {...props} viewBox={viewBox}>
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
      <text
        fill={color}
        {...numOffset}
        fontSize={numSize}
        textAnchor="middle"
        dominantBaseline="central"
        filter="url(#outline)"
      >
        {num}
      </text>
      <text
        fill={color}
        {...numOffset}
        fontSize={numSize}
        textAnchor="middle"
        dominantBaseline="central"
        filter="url(#outline)"
        transform={pipFlip}
      >
        {num}
      </text>
      {num % 2 === 1 ? (
        /*Center Pip*/ <>
          <image
            href={pip}
            height={cPipHeight}
            {...pipC}
            filter="url(#outline)"
          />
        </>
      ) : undefined}
      {num > 1 ? (
        /*Top And Bottom Pip*/ <>
          <image
            href={pip}
            height={rPipHeight}
            {...pipT}
            filter="url(#outline)"
          />
          <image
            href={pip}
            height={rPipHeight}
            {...pipT}
            filter="url(#outline)"
            transform={pipFlip}
          />
        </>
      ) : undefined}
      {num > 3 ? (
        /*Left And Right Pip*/ <>
          <image
            href={pip}
            height={rPipHeight}
            {...pipR}
            filter="url(#outline)"
          />
          <image
            href={pip}
            height={rPipHeight}
            {...pipR}
            filter="url(#outline)"
            transform={pipFlip}
          />
        </>
      ) : undefined}
    </svg>
  );
}
