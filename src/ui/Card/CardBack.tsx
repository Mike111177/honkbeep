import { ComponentPropsWithoutRef } from "react";
import chroma from "chroma-js";

import { vecAdd, vecMul } from "../util/Vector";
import { Pips } from "../../game/types/Empathy";
import colors from "../BaseColors";
import pipsIcons from "../pips";

import { OutlineFilter, CardRectangle, CardSVG } from ".";
import { CARD_VIEW_MIDPOINT as mid } from "./Constants";

export type CardBackProps = {
  suits: string[];
  pips: Pips;
  borderOverride?: string;
} & ComponentPropsWithoutRef<"svg">;

const pipHeight = 17.5;
const pipOff = { x: -pipHeight / 2, y: -pipHeight / 2 };
const pipCenter = vecAdd(mid, pipOff);

export default function CardBack({
  suits,
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
      <image
        key={suits.findIndex((i) => i === pips.suits[0])}
        href={pipsIcons[pips.suits[0]]}
        height={20}
        {...pipCenter}
        filter="url(#outline)"
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
          <image
            key={n}
            href={pipsIcons[s]}
            height={20}
            {...loc}
            filter="url(#outline)"
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
          filter="url(#outline)"
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
      {OutlineFilter}
      <CardRectangle
        border={borderOverride ?? color}
        background={backgroundColor}
      />
      {suitPips}
      {numberPips}
    </CardSVG>
  );
}
