import { ComponentPropsWithoutRef } from "react";
import chroma from "chroma-js";
import colors from "../../../BaseColors";
import { CardRectangle, CardSVG } from "./CardUtil";

import styles from "./Card.module.css";
import { CardData } from "../../../../game/GameTypes";

export type CardIconProps = {
  card: Readonly<CardData>;
} & ComponentPropsWithoutRef<"svg">;

export default function CardIcon({
  card: { suit, rank },
  ...props
}: CardIconProps) {
  let color = colors(suit);
  const backgroundColor = chroma.mix(color, "#FFFFFF", 0.6, "lrgb").hex();
  return (
    <CardSVG className={styles.CardIcon} height="1em" {...props}>
      <CardRectangle background={backgroundColor} border={color} />
      <text
        fill={color}
        fontSize="120px"
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        stroke="black"
        strokeWidth="2.5%"
      >
        {rank}
      </text>
    </CardSVG>
  );
}
