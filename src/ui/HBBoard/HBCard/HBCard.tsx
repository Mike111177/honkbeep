import "./HBCard.scss"
import colors from "../../colors"

export type HBCardProps = {
  rank: number,
  suit: string
}

export default function HBCard({ suit, rank }: HBCardProps) {
  let colorData = colors[suit];
  const num = rank;
  return (
    <div className="HBCard" style={{ borderColor: colorData.fill, backgroundColor: colorData.back, color: colorData.fill }}>
      <svg height="40px" width="20%">
        <text className='rank' x='50%' y='50%' fontSize='40px' textAnchor='middle' dominantBaseline='central'>
          {num}
        </text>
      </svg>
      {/*<div className="cardNumber cardNumber-top">{num}</div>*/}
      <img className="cardPip cardPip1" src={colorData.pip} alt="" hidden={!(num === 4 || num === 5)} />
      <img className="cardPip cardPip2" src={colorData.pip} alt="" hidden={num === 2 || num === 4} />
      <img className="cardPip cardPip3" src={colorData.pip} alt="" hidden={!(num === 4 || num === 5)} />
      <img className="cardPip cardPip4" src={colorData.pip} alt="" hidden={num === 1} />
      <img className="cardPip cardPip5" src={colorData.pip} alt="" hidden={num === 1} />
      <div className="cardNumber cardNumber-bottom">{rank}</div>
    </div>
  );
}
