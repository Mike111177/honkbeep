import { ComponentPropsWithoutRef, createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring/web.cjs";

import { useDrag } from "./InputHandling";

export class DragManager {
  dragging: boolean = false;
  zone?: string;
}

//I hate this context, legitimatley thinking about replacing with a global singleton
export const DragContext = createContext(new DragManager());

type DraggableProps = {
  children: ReactNode;
  onDrop?: (target: string) => boolean;
};
export function Draggable({ children, onDrop, ...props }: DraggableProps) {
  const dragContext = useContext(DragContext);

  const ref = useRef<HTMLDivElement>(null);
  const [{ x, y }, setSpring] = useSpring(() => ({ x: 0, y: 0 }));
  const attach = useDrag(ref, ({down, offset:{x,y}}) => {
    if (down) {
      dragContext.dragging = true;
      //Extremly high parameters to make draging not look laggy
      setSpring({x, y, config: {friction:150, tension:10000}});
    } else {
      if (dragContext.zone != null && onDrop !== undefined){
        onDrop(dragContext.zone);
      }
      //Relaxed parameters to make bounce back pretty
      setSpring({x:0, y:0, config: {friction:25, tension:750}});
    }
  });

  return (
    <animated.div ref={ref} {...attach} {...props} style={{ x, y, touchAction: 'none' }}>
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
            dragContext.zone = undefined;
          }
        }
      }
    };
    window.addEventListener('mousemove', listener);
    return () => window.removeEventListener('mousemove', listener);
  }, [dragContext, id, targeted])
  return (
    <div ref={element} {...props}>
      {children}
    </div>
  );
}

export function DragArea({ children }: any) {
  return <DragContext.Provider value={new DragManager()}>{children}</DragContext.Provider>
}
