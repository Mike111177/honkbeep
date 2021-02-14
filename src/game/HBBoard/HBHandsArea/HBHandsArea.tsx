import HBHand from "../HBStackArea/HBStackArea" //OBVIOUS PLACEHOLDER LUL

export default function HBHandsArea() {
    return (
      <div className="HBHandsArea" style={{display:"grid"}}>
          {[1,2,3,4].map((n, i)=>
          <div style={{display:"grid", justifyContent: "center", alignContent:"center"}}>
            <HBHand colors={["Red","Green", "Yellow", "Blue", "Purple"]}/>
            <span>Player {i}</span>
          </div>
          )}
      </div>
    )
}