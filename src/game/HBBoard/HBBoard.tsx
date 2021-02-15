import HBClueArea from "./HBClueArea/HBClueArea"
import HBStackArea from "./HBStackArea/HBStackArea"
import HBHandsArea from "./HBHandsArea/HBHandsArea"
import './HBBoard.scss'

export default function HBBoard() {
    const colors = ["Red", "Yellow", "Green", "Blue", "Purple"];
    return (
        <div className="HBBoard">
            <div className="HBPlayHistory" />
            <div className="handsWrapper" style={{ gridRowStart: 1, gridRowEnd: 5, gridColumn: 2 }}>
                <HBHandsArea />
            </div>
            <div className="HBClueHistory" style={{ gridRowStart: 1, gridRowEnd: 3, gridColumn: 3 }} />
            <div className="HBDiscardArea" style={{ gridRowStart: 3, gridRowEnd: 5, gridColumn: 3 }} />
            <HBStackArea colors={colors} />
            <HBClueArea colors={colors} />
            <div className="HBGeneralControls" />
        </div>
    )
}