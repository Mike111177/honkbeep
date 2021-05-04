import { ComponentPropsWithoutRef } from "react";
import { mix } from "chroma-js";

import { vecAdd, vecMul } from "../../../util/Geometry";
import { Pips } from "../../../client/types/Empathy";
import Variant from "../../../game/types/Variant";
import colors from "../../BaseColors";
import pipShapes from "../../SuitPips";
import { Pip, PipShape } from "../Pip";

import { CardRectangle, CardSVG } from ".";
import { CARD_VIEW_MIDPOINT as mid } from "./Constants";
import CardFront from "./CardFront";

import styles from "./Card.css";

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

function PipCircle(pips: Pips, suits: ReadonlyArray<string>) {
  return suits.map((s, n) => {
    if (pips.suits.findIndex((i) => s === i) !== -1) {
      let angle = (2 * Math.PI * n) / suits.length;
      let loc = vecAdd(
        pipCenter,
        vecMul({ x: -Math.sin(angle), y: -Math.cos(angle) }, 30)
      );
      return (
        <Pip key={n} shape={pipShapes[s]} fill={colors(s)} size={20} {...loc} />
      );
    } else {
      return undefined;
    }
  });
}

function BigCenterPip({ shape, color }: { shape: PipShape; color: string }) {
  return (
    <Pip shape={shape} fill={color} size={bigPipHeight} {...bigPipCenter} />
  );
}

function NumberPips({ ranks }: { ranks: Pips["ranks"] }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((n, i) => {
        if (ranks.findIndex((i) => n === i) !== -1) {
          return (
            <text
              key={n}
              className={styles.CardRankPip}
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="white"
              x={(mid.x * (i + 1)) / 3}
              y="130"
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
      })}
    </>
  );
}

function CardBackUnknown({
  variant: { suits },
  pips,
  borderOverride,
  ...props
}: CardBackProps) {
  const color = pips.suits.length === 1 ? colors(pips.suits[0]) : "#777777";
  const backgroundColor = mix(color, "#FFFFFF", 0.5, "lrgb").hex();
  return (
    <CardSVG {...props}>
      <CardRectangle
        border={borderOverride ?? color}
        background={backgroundColor}
      />
      {pips.suits.length === 1 ? (
        <BigCenterPip shape={pipShapes[pips.suits[0]]} color={color} />
      ) : (
        PipCircle(pips, suits)
      )}
      <NumberPips ranks={pips.ranks} />
    </CardSVG>
  );
}

export default function CardBack(props: CardBackProps) {
  return props.pips.ranks.length === 1 && props.pips.suits.length === 1 ? (
    <CardFront
      card={{ rank: props.pips.ranks[0], suit: props.pips.suits[0] }}
      borderOverride={props.borderOverride}
    />
  ) : (
    <CardBackUnknown {...props} />
  );
}
