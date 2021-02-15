import HBHand from "./HBHand" //OBVIOUS PLACEHOLDER LUL

export default function HBHandsArea() {
    return (
      <div className="HBHandsArea">
        {["Alice", "Bob", "Cathy", "Donald" /*, "Emily"*/].map((n)=><HBHand username={n}/>)}
      </div>
    )
}