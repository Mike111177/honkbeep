import React from "react"
import HBCard, { HBCardProps } from "../HBCard/HBCard"
import { useSpring, animated } from 'react-spring'
import { useDrag } from 'react-use-gesture'

import { GameDefinitionContext } from '../../Game'

import "./HBHand.scss"

let target_x = 100;
let target_y = 200;

function DraggableCard({ rank, color }: HBCardProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isTargeting, setIsTargeting] = React.useState(false);
  const [{ tx, ty }, setTarget] = React.useState({ tx: target_x, ty: target_y });


  //div
  const divElement = React.useRef<HTMLDivElement | null>(null);

  //Get Spring position
  const [spring, setSpring] = useSpring(() => ({ x: 0, y: 0 }))

  //On DragUpdate
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    let dragging = isDragging;
    let targeting = isTargeting;

    if (!targeting) {

      if (down) {
        setIsDragging(true);
        dragging = true;
      }

      if (!down && dragging) {
        setIsDragging(false);
        dragging = false;
        setIsTargeting(true);
        targeting = true;
      }

      if (!targeting) {
        setSpring({ x: down ? mx : 0, y: down ? my : 0, config: { friction: down ? 100 : 50, tension: 1000000 } });
      } else {
        if (divElement.current) {
          let rect = divElement.current.getBoundingClientRect();
          console.log(spring);

          let offset_x = tx - rect.x + mx;
          let offset_y = ty - rect.y + my;
          setSpring({ x: offset_x, y: offset_y, config: { friction: 100, tension: 1000 } });
        }
      }
    }

  })
  return (
    <animated.div ref={divElement} {...bind()} style={{ x: spring.x, y: spring.y, touchAction: 'none' }}>
      <HBCard rank={rank} color={color} />
    </animated.div>
  )
}

type HBHandProps = {
  player: number
}

export default function HBHand({ player }: HBHandProps) {
  const { playerNames } = React.useContext(GameDefinitionContext);
  return (
    <div className="HBHand">
      <div className="handCardArea">
        <DraggableCard rank={1} color="Blue" />
        <DraggableCard rank={2} color="Red" />
        <DraggableCard rank={3} color="Purple" />
        <DraggableCard rank={4} color="Green" />
        <DraggableCard rank={5} color="Yellow" />
      </div>
      <div className="handNameArea">
        {playerNames[player]}
      </div>
    </div>
  )

}