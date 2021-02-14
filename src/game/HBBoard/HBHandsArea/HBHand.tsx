import HBCard, {HBCardProps} from "../HBCard/HBCard"
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'
import "./HBHand.scss"

function DraggableCard({number, color}:HBCardProps){
    const [{ x, y }, set] = useSpring(() => ({ x: 0, y: 0 }))
    const bind = useDrag(({ down, movement: [mx, my] }) => {
        set({ x: down ? mx : 0, y: down ? my : 0 })
    })
    console.log(x,y)
    return (
    <animated.div {...bind()} style={{x, y, touchAction: 'none' }}>
      <HBCard number={number} color={color}/>
    </animated.div>
    )
}

type HBHandProps = {
    username:string
}

export default function HBHand({username}:HBHandProps) {
    return (
        <div className="HBHand">
            <div className="handCardArea">
                <DraggableCard number={1} color="Blue"/>
                <DraggableCard number={2} color="Red"/>
                <DraggableCard number={3} color="Purple"/>
                <DraggableCard number={4} color="Green"/>
                <DraggableCard number={5} color="Yellow"/>
            </div>
            <div className="handNameArea">
                {username}
            </div>
        </div>
    )

}