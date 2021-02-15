import "./HBClueArea.scss"
import Colors from "../../colors"

enum ClueType {
    Color = 1,
    Number = 2
}

type HBClueButtonProps = {
    type: ClueType,
    value: string | number
}

function HBClueButton({ type, value }: HBClueButtonProps) {
    if (type === ClueType.Color) {
        const color = Colors[value];
        return (
            <div className="clueButton">
                <div className="clueButtonIconColor" style={{ backgroundColor: color.fill }} />
            </div>
        );
    } else {
        return (
            <div className="clueButton">
                <div className="clueButtonIconNumber">
                    {value.toString()}
                </div>
            </div>
        );
    }
}

type HBClueAreaProps = {
    colors: string[]
}

export default function HBClueArea({ colors }: HBClueAreaProps) {
    return (
        <div className="HBClueArea">
            <div className="HBClueButtonAreaSuit" style={{ gridTemplateColumns: `repeat(${colors.length}, auto)` }}>
                {colors.map(c => <HBClueButton type={ClueType.Color} value={c} />)}
            </div>
            <div className="HBClueButtonAreaNumber">
                {[1, 2, 3, 4, 5].map(i => <HBClueButton type={ClueType.Number} value={i} />)}
            </div>
            <div className="submitButton">
                Submit Clue
                </div>
        </div>
    )
}