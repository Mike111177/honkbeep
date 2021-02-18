import "./HBStack.scss"
import colors from "../../colors"
import HBCard from "../HBCard/HBCard"

type HBStackProps = {
  number: number,
  suit: string
}

export default function HBStack({ suit, number }: HBStackProps) {
  const colorData = colors[suit];
  if (number === 0) {
    return (
      <div className="HBStack" style={{ borderColor: colorData.fill, backgroundColor: colorData.back + "7f", color: colorData.fill }}>
        <img className="stackPip" src={colorData.pip} alt="" />
      </div>
    );
  } else {
    return (<HBCard rank={number} suit={suit} />);
  }
}
