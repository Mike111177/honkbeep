import colors from "../BaseColors";
import pips from "../pips";
import { ComponentPropsWithoutRef } from "react";
import { vecAdd, vecSub } from "../util/Vector";
import { OutlineFilter, CardDim, CardRectangle, CardSVG } from "./CardUtil";
import chroma from "chroma-js";
import { CardData } from "../../game/GameTypes";

export type CardFrontProps = {
  card: Readonly<CardData>;
  borderOverride?: string;
} & ComponentPropsWithoutRef<"svg">;

//Tweakables
const rPipHeight = 17.5;
const cPipHeight = 27.5;
const pipDist = { x: 30, y: 35 };
const numOffset = { x: 25, y: 30 };
const numSize = 50;

//Calculated Constants
const { mid } = CardDim;

const pipCorner = vecSub(mid, pipDist);

const rPipOff = { x: -rPipHeight / 2, y: -rPipHeight / 2 };
const cPipOff = { x: -cPipHeight / 2, y: -cPipHeight / 2 };

const pipFlip = `rotate(180 ${mid.x} ${mid.y})`;

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
  return (
    <CardSVG className="HBCardFront" {...props}>
      {OutlineFilter}
      <CardRectangle
        border={borderOverride ?? color}
        background={backgroundColor}
      />
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
      <text
        fill={color}
        {...numOffset}
        fontSize={numSize}
        textAnchor="middle"
        dominantBaseline="central"
        transform={pipFlip}
        stroke="black"
        strokeWidth="1%"
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
    </CardSVG>
  );
}