import {Component} from "react"
import "./HBClueButton.scss"
import Colors from "../../../colors"

export enum ClueType{
    Color = 1,
    Number = 2
}

type HBClueButtonProps = {
    type: ClueType,
    value: string|number
}

export default class HBClueButton extends Component<HBClueButtonProps>{
    render(): JSX.Element {
        if (this.props.type === ClueType.Color){
            const color = Colors[this.props.value];
            return (
                <div className="clueButton">
                    <div className="clueButtonIconColor" style={{backgroundColor: color.fill}}/>
                </div>
            );
        } else {
            return (
                <div className="clueButton">
                    <div className="clueButtonIconNumber">
                        {this.props.value.toString()}
                    </div>
                </div>
            );
        }
    }
}
