import { cloneElement, ComponentPropsWithoutRef } from "react";
import { mix } from "chroma-js";

import colors from "../BaseColors";
import pipShapes from "../SuitPips";
import { Pip } from "../components/Pip";
import { Card } from "../../game";
import { vecAdd, vecSub } from "../../util/Vector";
import { CARD_VIEW_MIDPOINT as mid, CardRectangle, CardSVG } from ".";

export type CardFrontProps = {
  card: Card;
  borderOverride?: string;
} & ComponentPropsWithoutRef<"svg">;

//Tweakables
const rPipHeight = 17.5;
const cPipHeight = 27.5;
const pipDist = { x: 30, y: 35 };
const numOffset = { x: 27, y: 32 };
const numSize = 50;

const pipCorner = vecSub(mid, pipDist);

const rPipOff = { x: -rPipHeight / 2, y: -rPipHeight / 2 };
const cPipOff = { x: -cPipHeight / 2, y: -cPipHeight / 2 };

const pipFlip = { transform: `rotate(180 ${mid.x} ${mid.y})` };

const pipT = vecAdd({ x: mid.x, y: pipCorner.y }, rPipOff);
const pipR = vecAdd({ x: pipCorner.x, y: mid.y }, rPipOff);
const pipC = vecAdd(mid, cPipOff);

//For rendering front-face of absolutely known card
export default function CardFront({
  card: { rank, suit },
  borderOverride,
  ...props
}: CardFrontProps) {
  let color = colors(suit);
  let pip = pipShapes[suit];

  const cPip = <Pip shape={pip} size={cPipHeight} fill={color} {...pipC} />;
  const tPip = cloneElement(cPip, {
    size: rPipHeight,
    ...pipT,
    strokeWidth: "7%",
  });
  const lPip = cloneElement(tPip, pipR);
  const cornerPips = (
    <g>
      <text
        fill={color}
        {...numOffset}
        fontSize={numSize}
        textAnchor="middle"
        dominantBaseline="central"
        stroke="black"
        strokeWidth="4"
        paintOrder="stroke fill"
        strokeLinejoin="round"
      >
        {rank}
      </text>
      {rank > 1 ? tPip : undefined}
      {rank > 3 ? lPip : undefined}
    </g>
  );
  return (
    <CardSVG {...props}>
      <CardRectangle
        border={borderOverride ?? color}
        background={mix(color, "white").hex()}
      />
      {rank % 2 === 1 ? cPip : undefined}
      {cornerPips}
      {cloneElement(cornerPips, pipFlip)}
    </CardSVG>
  );
}
