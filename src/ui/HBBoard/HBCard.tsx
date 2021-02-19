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
    <div style={{ margin: "2.5px" }}>
      <svg height="150" width="110">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="0" stdDeviation="2" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="5%" y="5%" width="90%" height="90%" fill={colorData.back} strokeWidth="2.5%" stroke={colorData.fill} rx="5%" />
        <text fill={colorData.fill} className='rank' x='20%' y='20%' fontSize='50px' textAnchor='middle' dominantBaseline='central' strokeWidth="1.5" stroke="black">{num}</text>
        {/*Center Pip*/ num % 2 === 1 ? <image href={colorData.pip} height="15%" x="38%" y="42.5%"/> : undefined}
        {   /*Top Pip*/       num > 1 ? <image href={colorData.pip} height="15%" x="38%" y="20%"  /> : undefined}
        {/*Bottom Pip*/       num > 1 ? <image href={colorData.pip} height="15%" x="38%" y="65%"  /> : undefined}
        {  /*Left Pip*/       num > 3 ? <image href={colorData.pip} height="15%" x="10%" y="42.5%"/> : undefined}
        { /*Right Pip*/       num > 3 ? <image href={colorData.pip} height="15%" x="65%" y="42.5%"/> : undefined}
        <text rotate="180" fill={colorData.fill} className='rank' x='105%' y='55%' fontSize='50px' textAnchor='middle' dominantBaseline='central' strokeWidth="1.5" stroke="black">{num}</text>
      </svg>
    </div>
  );
}

{/*<div className="cardNumber cardNumber-top">{num}</div>
<img className="cardPip cardPip1" src={colorData.pip} alt="" hidden={!(num === 4 || num === 5)} />
<img className="cardPip cardPip2" src={colorData.pip} alt="" hidden={num === 2 || num === 4} />
<img className="cardPip cardPip3" src={colorData.pip} alt="" hidden={!(num === 4 || num === 5)} />
<img className="cardPip cardPip4" src={colorData.pip} alt="" hidden={num === 1} />
<img className="cardPip cardPip5" src={colorData.pip} alt="" hidden={num === 1} />
*/}