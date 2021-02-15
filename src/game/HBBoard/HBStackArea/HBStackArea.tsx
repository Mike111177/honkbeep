import "./HBStackArea.scss"
import HBStack from "../HBStack/HBStack"

type HBStackAreaProps = {
    colors: string[]
}

export default function HBStackArea({ colors }: HBStackAreaProps) {
    return (
        <div className="HBStackArea" style={{ gridTemplateColumns: `repeat(${colors.length}, auto)` }}>
            {colors.map(c => <HBStack color={c} number={0} />)}
        </div>
    )
}