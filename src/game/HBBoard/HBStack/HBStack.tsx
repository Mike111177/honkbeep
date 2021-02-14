import {Component} from "react"
import "./HBStack.scss"
import colors from "../../colors"
import HBCard from "../HBCard/HBCard"

type HBStackProps = {
    number: number,
    color: string
}

export default class HBStack extends Component<HBStackProps>{

    static defaultProps = {
        number: 0,
        color: "Red"
    }
    
    render(): JSX.Element {
        let color = colors[this.props.color];
        let num = this.props.number;
        if (num === 0){
          return (
            <div className="HBStack" style={{borderColor: color.fill, backgroundColor: color.back+"7f", color: color.fill}}>
              <img className="stackPip" src={color.pip} alt=""/>
            </div>
          );
        } else {
          return (<HBCard number={num} color={this.props.color}/>);
        }
      }

}