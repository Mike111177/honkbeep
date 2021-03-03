import React from "react";

import { GameUIContext } from '../ReactFrontendInterface';
import { Clue, ClueType } from "../../game/GameTypes";
import colors from "../BaseColors";

import "./HBClueArea.scss";

function HBClueButton({clue}:{clue:Clue}) {
    if (clue.type === ClueType.Color) {
        const color = colors(clue.color);
        return (
          <svg height="60px" viewBox="0 0 100 100">
            <rect x="10%" y="10%" width="80%" height="80%" rx="10%" fill={color} stroke="#000000" strokeWidth="10%"/>  
          </svg>
        );
    } else if (clue.type === ClueType.Number){
        return (
          <svg height="60px" viewBox="0 0 100 100">
            <rect x="10%" y="10%" width="80%" height="80%" rx="10%" fill="#000000" stroke="#000000" strokeWidth="10%" /> 
            <text fill="#FFFFFF" fontSize="80" x="50%" y="47.5%" textAnchor='middle' dominantBaseline='central'>{clue.number}</text>
          </svg>
        );
    } else {
      return <></>;
    }
}

export default function HBClueArea() {
    const suits = React.useContext(GameUIContext).getSuits();
    return (
        <div className="HBClueArea">
            <div className="HBClueButtonAreaSuit" style={{ gridTemplateColumns: `repeat(${suits.length}, auto)` }}>
                {suits.map((c, i) => <HBClueButton key={i}  clue={{type: ClueType.Color, color: c }}/>)}
            </div>
            <div className="HBClueButtonAreaNumber">
                {[1, 2, 3, 4, 5].map((i, n) => <HBClueButton key={n} clue={{type: ClueType.Number, number: i }} />)}
            </div>
            <div className="submitButton">
                Submit Clue
            </div>
        </div>
    );
}
