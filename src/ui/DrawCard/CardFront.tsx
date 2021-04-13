import { ComponentPropsWithoutRef } from "react";
import chroma from "chroma-js";

import colors from "../BaseColors";
import pips, { Pip } from "../pips";
import { vecAdd, vecSub } from "../../util/Vector";

import { CardRectangle, CardSVG } from ".";
import { CARD_VIEW_MIDPOINT as mid } from "./Constants";
import { Card } from "../../game";
import React from "react";

export type CardFrontProps = {
  card: Card;
  borderOverride?: string;
} & ComponentPropsWithoutRef<"svg">;

//Tweakables
const rPipHeight = 17.5;
const cPipHeight = 27.5;
const pipDist = { x: 30, y: 35 };
const numOffset = { x: 25, y: 30 };
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
  let pip = pips[suit];
  const num = rank;
  const backgroundColor = chroma.mix(color, "#FFFFFF", 0.5, "lrgb").hex();
  const tNum = (
    <text
      fill={color}
      {...numOffset}
      fontSize={numSize}
      textAnchor="middle"
      dominantBaseline="central"
      stroke="black"
      strokeWidth="1%"
    >
      {num}
    </text>
  );
  const cPip = <Pip pip={pip} size={cPipHeight} fill={color} {...pipC} />;
  const tPip = React.cloneElement(cPip, {
    size: rPipHeight,
    ...pipT,
    strokeWidth: "7%",
  });
  const lPip = React.cloneElement(tPip, pipR);
  const topLeftItems = (
    <>
      {tNum}
      {num > 1 ? tPip : undefined}
      {num > 3 ? lPip : undefined}
    </>
  );

  return (
    <CardSVG {...props}>
      <CardRectangle
        border={borderOverride ?? color}
        background={backgroundColor}
      />
      {num % 2 === 1 ? cPip : undefined}
      {topLeftItems}
      <g {...pipFlip}>{topLeftItems}</g>
    </CardSVG>
  );
}
