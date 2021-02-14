import {Component} from "react"
import "./HBClueArea.scss"
import HBClueButton, {ClueType} from "./HBClueButton/HBClueButton"

type HBClueAreaProps = {
    colors: string[]
}

export default class HBClueArea extends Component<HBClueAreaProps>{    
    render(): JSX.Element {
        let colors = this.props.colors;
        return (
            <div className="HBClueArea">
                <div className="HBClueButtonAreaSuit" style={{gridTemplateColumns: `repeat(${colors.length}, auto)`}}>
                    {colors.map(c=><HBClueButton type={ClueType.Color} value={c}/>)}
                </div>
                <div className="HBClueButtonAreaNumber">
                    {[1,2,3,4,5].map(i=><HBClueButton type={ClueType.Number} value={i}/>)}
                </div>
            </div>
        )
    }

}