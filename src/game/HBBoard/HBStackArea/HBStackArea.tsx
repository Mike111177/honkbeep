import {Component} from "react"
import "./HBStackArea.scss"
import HBStack from "../HBStack/HBStack"

type HBStackAreaProps = {
    colors: string[]
}

export default class HBStackArea extends Component<HBStackAreaProps>{
    render(): JSX.Element {
        let colors = this.props.colors;
        return (
        <div className="HBStackArea" style={{gridTemplateColumns: `repeat(${colors.length}, auto)`}}>
            {colors.map(c=><HBStack color={c} number={0}/>)}
        </div>)
    }

}