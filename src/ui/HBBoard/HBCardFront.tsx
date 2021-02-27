import "./HBCard.scss";
import colors from "../colors";
import pips from "./pips";
import { ComponentProps } from "react";
import { vecAdd, vecMul, vecSub } from "../util/Vector";

export type HBCardProps = {
  rank: number;
  suit: string;
} & ComponentProps<"svg">

//Tweakables
const view = { x: 110, y: 150 };
const rPipHeight = 17.5;
const cPipHeight = 27.5;
const pipDist = { x: 30, y: 35 };
const numOffset = { x: 22.5, y: 30 };
const numSize = 50;

//Calculated Constants
const viewBox = `0 0 ${view.x} ${view.y}`;
const mid = vecMul(view, 0.5);

const pipCorner = vecSub(mid, pipDist);

const rPipOff = { x: - rPipHeight / 2, y: - rPipHeight / 2 };
const cPipOff = { x: - cPipHeight / 2, y: - cPipHeight / 2 };

const pipFlip = `rotate(180 ${mid.x} ${mid.y})`;

const pipT = vecAdd({ x: mid.x, y: pipCorner.y }, rPipOff);
const pipR = vecAdd({ x: pipCorner.x, y: mid.y }, rPipOff);
const pipC = vecAdd(mid, cPipOff);

//For rendering frontface of absolutley known card
//TODO: The bottom and right-hand pips should be flipped 180 degrees
//TODO: It might be a good idea to add a pre-render step for all of the possible card faces
export default function HBCardFront({ suit, rank, ...props }: HBCardProps) {
  let colorData = colors[suit];
  let pip = pips[suit];
  const num = rank;
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
      <rect x="5%" y="5%" width="90%" height="90%" fill={colorData.back} strokeWidth="2.5%" stroke={colorData.fill} rx="5%" />
      <text fill={colorData.fill} {...numOffset} fontSize={numSize} textAnchor='middle' dominantBaseline='central' filter="url(#outline)">{num}</text>
      <text fill={colorData.fill} {...numOffset} fontSize={numSize} textAnchor='middle' dominantBaseline='central' filter="url(#outline)" transform={pipFlip}>{num}</text>
      { num % 2 === 1 ? /*Center Pip*/ <>
        <image href={pip} height={cPipHeight} {...pipC} filter="url(#outline)" />
      </> : undefined}
      { num > 1 ? /*Top And Bottom Pip*/ <>
        <image href={pip} height={rPipHeight} {...pipT} filter="url(#outline)" />
        <image href={pip} height={rPipHeight} {...pipT} filter="url(#outline)" transform={pipFlip} />
      </> : undefined}
      { num > 3 ? /*Left And Right Pip*/ <>
        <image href={pip} height={rPipHeight} {...pipR} filter="url(#outline)" />
        <image href={pip} height={rPipHeight} {...pipR} filter="url(#outline)" transform={pipFlip} />
      </> : undefined}

    </svg>
  );
}
