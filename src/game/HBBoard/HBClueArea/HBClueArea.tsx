import {Component} from "react"
import "./HBClueArea.scss"
import HBClueButton, {ClueType} from "./HBClueButton/HBClueButton"

type HBClueAreaProps = {
    colors: string[]
}

export default class HBClueArea extends Component<HBClueAreaProps>{

    static defaultProps = {
        colors: ["Red", "Yellow", "Green", "Blue", "Purple"]
    }
    
    render(): JSX.Element {
        let colors = this.props.colors;
        return (
            <div className="HBClueArea">
                <div className="HBClueButtonArea">
                    {colors.map(c=><HBClueButton type={ClueType.Color} value={c}/>)}
                    {[1,2,3,4,5].map(i=><HBClueButton type={ClueType.Number} value={i}/>)}
                </div>
            </div>
        )
    }

}