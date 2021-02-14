import {Component} from "react"
import "./HBCard.scss"
import colors from "../../colors"

export type HBCardProps = {
    number: number,
    color: string
}

export default class HBCard extends Component<HBCardProps>{

    static defaultProps = {
        number: 1,
        color: "Red"
    }
    
    render(): JSX.Element {
        let color = colors[this.props.color];
        const num = this.props.number;
        return (
          <div className="HBCard" style={{borderColor: color.fill, backgroundColor: color.back, color: color.fill}}>
            <div className="cardNumber cardNumber-top">{num}</div>
            <img className="cardPip cardPip1" src={color.pip} alt="" hidden={!(num === 4 || num === 5)}/>
            <img className="cardPip cardPip2" src={color.pip} alt="" hidden={num===2||num===4}/>
            <img className="cardPip cardPip3" src={color.pip} alt="" hidden={!(num === 4 || num === 5)}/>
            <img className="cardPip cardPip4" src={color.pip} alt="" hidden={num===1}/>
            <img className="cardPip cardPip5" src={color.pip} alt="" hidden={num===1}/>
            <div className="cardNumber cardNumber-bottom">{this.props.number}</div>
          </div>
        );
      }

}