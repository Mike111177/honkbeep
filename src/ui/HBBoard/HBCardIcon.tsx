import chroma from "chroma-js";
import colors from "../BaseColors";
import { CardDim, OutlineFilter, ThickOutlineFilter } from "./CardUtil";
import { HBCardProps } from "./HBCardFront";

const { mid, viewBox } = CardDim;

export default function HBCardIcon({ suit, rank, ...props }: HBCardProps) {
  let color = colors(suit);
  const num = rank;
  const backgroundColor = chroma.mix(color,"#FFFFFF", 0.5, "lrgb").hex();
  return (
    <svg {...props} viewBox={viewBox}>
      {ThickOutlineFilter}
      <rect x="5%" y="5%" width="90%" height="90%" fill={backgroundColor} strokeWidth="2.5%" stroke={color} rx="5%" />
      <text fill={color} fontSize="130px"
        x="50%"
        y="50%"
        textAnchor='middle'
        dominantBaseline='central'
        filter="url(#thickoutline)">{num}
      </text>

    </svg>
  );
}
