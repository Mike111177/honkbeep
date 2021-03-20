import chroma from "chroma-js";
import colors from "../../BaseColors";
import { CardDim, ThickOutlineFilter } from "./CardUtil";
import { HBCardProps } from "./HBCardFront";

const { viewBox } = CardDim;

export default function HBCardIcon({ suit, rank, ...props }: HBCardProps) {
  let color = colors(suit);
  const num = rank;
  const backgroundColor = chroma.mix(color, "#FFFFFF", 0.5, "lrgb").hex();
  return (
    <svg {...props} viewBox={viewBox}>
      {ThickOutlineFilter}
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
        strokeWidth="11%"
        stroke="#000000"
        rx="5%"
      />
      <rect
        x="5%"
        y="5%"
        width="90%"
        height="90%"
        fill="#00000000"
        strokeWidth="8%"
        stroke={color}
        rx="5%"
      />
      <text
        fill={color}
        fontSize="120px"
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        filter="url(#thickoutline)"
      >
        {num}
      </text>
    </svg>
  );
}
