import "./HBCard.scss"
import colors from "../colors"

export type HBCardProps = {
  rank: number,
  suit: string
}

export default function HBCard({ suit, rank }: HBCardProps) {
  let colorData = colors[suit];
  const num = rank;
  return (
      <svg height="150" width="110" style={{ margin: "2.5px", userSelect:"none" }}>
        <defs>
          <filter id="outline">
          <feComponentTransfer>
            <feFuncR type="linear" slope="0"/>
            <feFuncG type="linear" slope="0"/>
            <feFuncB type="linear" slope="0"/>
          </feComponentTransfer>
          <feMorphology operator="dilate" radius="1"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
          </filter>
        </defs>
        <rect x="5%" y="5%" width="90%" height="90%" fill={colorData.back} strokeWidth="2.5%" stroke={colorData.fill} rx="5%" />
        <text fill={colorData.fill} className='rank' x='20%' y='20%' fontSize='50px' textAnchor='middle' dominantBaseline='central' filter="url(#outline)">{num}</text>
        {/*Center Pip*/ num % 2 === 1 ? <image href={colorData.pip} height="17.5%" x="37.5%" y="40%" filter="url(#outline)"/> : undefined}
        {   /*Top Pip*/       num > 1 ? <image href={colorData.pip} height="12.5%" x="40.5%" y="20%" filter="url(#outline)"/> : undefined}
        {/*Bottom Pip*/       num > 1 ? <image href={colorData.pip} height="12.5%" x="40.5%" y="65%" filter="url(#outline)"/> : undefined}
        {  /*Left Pip*/       num > 3 ? <image href={colorData.pip} height="12.5%" x="12.5%" y="42.5%" filter="url(#outline)"/> : undefined}
        { /*Right Pip*/       num > 3 ? <image href={colorData.pip} height="12.5%" x="67.5%" y="42.5%" filter="url(#outline)"/> : undefined}
        <text rotate="180" fill={colorData.fill} className='rank' x='105%' y='55%' fontSize='50px' textAnchor='middle' dominantBaseline='central' filter="url(#outline)">{num}</text>
      </svg>
  );
}
