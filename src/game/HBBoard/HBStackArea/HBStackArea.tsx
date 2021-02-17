import React from "react"

import HBStack from "../HBStack/HBStack"
import {GameDefinitionContext} from '../../Game'

import "./HBStackArea.scss"

export default function HBStackArea() {
    const {suits} = React.useContext(GameDefinitionContext).variant;
    return (
        <div className="HBStackArea" style={{ gridTemplateColumns: `repeat(${suits.length}, auto)` }}>
            {suits.map((c,i) => <HBStack color={c} key={i} number={0} />)}
        </div>
    )
}