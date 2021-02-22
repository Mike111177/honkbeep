import { createContext, useContext, useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring/web.cjs";

class DragManager {
  dragging: boolean = false;
  zone: string | null = null;
}

const DragContext = createContext(new DragManager());

export function Draggable({ children, props, onDrop = ()=>{}}: any) {
  const dragContext = useContext(DragContext);
  const element = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState(false);
  const [dragVec, setDragVec] = useState(() => ({ x: 0, y: 0 }))
  const [spring, setSpring] = useSpring(() => ({ x: 0, y: 0 }))
  const listeners = {
    onPointerDown: (event: React.PointerEvent) => {
      if (event.button === 0) { //Left Click
        setDragging(true);
        dragContext.dragging = true;
        element.current!.setPointerCapture(event.pointerId);
      }
    },
    onPointerUp: (event: React.PointerEvent) => {
      if (event.button === 0) { //Left Click
        element.current!.releasePointerCapture(event.pointerId);
        setDragging(false);
        dragContext.dragging = false;
        dragVec.x = 0;
        dragVec.y = 0;
        setDragVec(dragVec);
        if (dragContext.zone != null) {
          onDrop(dragContext.zone);
          dragContext.zone = null;
          setSpring({ ...dragVec, immediate: true });
        } else {
          setSpring({ ...dragVec, config: { friction: 25, tension: 500 } });
        }
      }
    },
    onPointerMove: (event: React.PointerEvent) => {
      if (isDragging) {
        dragVec.x += event.movementX;
        dragVec.y += event.movementY;
        setDragVec(dragVec);
        setSpring({ ...dragVec, config: { friction: 150, tension: 10000 } });
      }
    },
    //Capture Right Clicks
    onContextMenu: (event: React.MouseEvent) => { event.preventDefault(); }
  };
  return (
    <animated.div ref={element} {...listeners} {...props} style={{ x: spring.x, y: spring.y, touchAction: 'none' }}>
      {children}
    </animated.div>
  );
}

export function DropZone({ children, id, ...props }: any) {
  const dragContext = useContext(DragContext);
  const element = useRef<HTMLDivElement>(null);
  const [targeted, setTargeted] = useState(false);

  useEffect(() => {
    const listener = ({ x, y }: MouseEvent) => {
      if (dragContext.dragging) {
        const rect = element.current!.getBoundingClientRect();
        if (rect.x < x && rect.x + rect.width > x &&
          rect.y < y && rect.y + rect.height > y) {
          if (!targeted) {
            setTargeted(true);
            dragContext.zone = id;
          }
        } else {
          if (targeted) {
            setTargeted(false);
            dragContext.zone = null;
          }
        }
      }
    };
    window.addEventListener('mousemove', listener);
    return () => window.removeEventListener('mousemove', listener);
  })
  return (
    <div ref={element} {...props}>
      {children}
    </div>
  );
}

export function DragArea({ children }: any) {
  return <DragContext.Provider value={new DragManager()}>{children}</DragContext.Provider>
}
