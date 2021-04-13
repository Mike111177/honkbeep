import { ComponentPropsWithoutRef } from "react";
import chroma from "chroma-js";

import { vecAdd, vecMul } from "../../util/Vector";
import { Pips } from "../../game/types/Empathy";
import Variant from "../../game/types/Variant";
import colors from "../BaseColors";
import pipShapes from "../SuitPips";
import { Pip } from "../components/Pip";

import { CardRectangle, CardSVG } from ".";
import { CARD_VIEW_MIDPOINT as mid } from "./Constants";

export type CardBackProps = {
  variant: Variant;
  pips: Pips;
  borderOverride?: string;
} & ComponentPropsWithoutRef<"svg">;

const pipHeight = 17.5;
const pipOff = { x: -pipHeight / 2, y: -pipHeight / 2 };
const pipCenter = vecAdd(mid, pipOff);
const bigPipHeight = 40;
const bigPipOff = { x: -bigPipHeight / 2, y: -bigPipHeight / 2 };
const bigPipCenter = vecAdd(mid, bigPipOff);

export default function CardBack({
  variant: { suits },
  pips,
  borderOverride,
  ...props
}: CardBackProps) {
  let color = "#777777";
  let suitPips;
  //let numberPips;
  if (pips.suits.length === 1) {
    color = colors(pips.suits[0]);
    suitPips = [
      <Pip
        key={suits.findIndex((i) => i === pips.suits[0])}
        shape={pipShapes[pips.suits[0]]}
        fill={color}
        size={bigPipHeight}
        {...bigPipCenter}
      />,
    ];
  } else {
    suitPips = suits.map((s, n) => {
      if (pips.suits.findIndex((i) => s === i) !== -1) {
        let angle = (2 * Math.PI * n) / suits.length;
        let loc = vecAdd(
          pipCenter,
          vecMul({ x: -Math.sin(angle), y: -Math.cos(angle) }, 30)
        );
        return (
          <Pip
            key={n}
            shape={pipShapes[s]}
            fill={colors(s)}
            size={20}
            {...loc}
          />
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
        <text
          key={n}
          fill="white"
          fontSize="20px"
          x={13 + i * 18}
          y="135"
          stroke="black"
          strokeWidth="3"
          paintOrder="stroke fill"
        >
          {n}
        </text>
      );
    } else {
      return undefined;
    }
  });

  return (
    <CardSVG {...props}>
      <CardRectangle
        border={borderOverride ?? color}
        background={backgroundColor}
      />
      {suitPips}
      {numberPips}
    </CardSVG>
  );
}
