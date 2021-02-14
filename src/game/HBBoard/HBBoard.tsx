import { Component } from "react"
import HBClueArea from "./HBClueArea/HBClueArea"
import HBStackArea from "./HBStackArea/HBStackArea"

export default class HBBoard extends Component<{}> {
    render(): JSX.Element {
        return (
        <>
            <HBStackArea/>
            <HBClueArea/>
        </>
        )
    }
}