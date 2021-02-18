import React from "react";

import {GameUIContext} from '../../ReactFrontendInterface'
import Colors from "../../colors"

import "./HBClueArea.scss"

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

export default function HBClueArea() {
    const suits = React.useContext(GameUIContext).getSuits();
    return (
        <div className="HBClueArea">
            <div className="HBClueButtonAreaSuit" style={{ gridTemplateColumns: `repeat(${suits.length}, auto)` }}>
                {suits.map((c, i) => <HBClueButton type={ClueType.Color} key={i} value={c} />)}
            </div>
            <div className="HBClueButtonAreaNumber">
                {[1, 2, 3, 4, 5].map((i, n) => <HBClueButton type={ClueType.Number} key={n} value={i} />)}
            </div>
            <div className="submitButton">
                Submit Clue
            </div>
        </div>
    )
}
