import { Component } from "react"
import HBClueArea from "./HBClueArea/HBClueArea"
import HBStackArea from "./HBStackArea/HBStackArea"

type HBBoardProps = {
    colors: string[]
}

export default class HBBoard extends Component<HBBoardProps> {
    static defaultProps = {
        colors: ["Red", "Yellow", "Green", "Blue", "Purple"]
    }

    render(): JSX.Element {
        const {colors} = this.props;
        return (
        <>
            <HBStackArea colors={colors}/>
            <HBClueArea colors={colors}/>
        </>
        )
    }
}