import { useMemo, useRef } from "react";
import { Vec2D, vecSub } from "../../util/Geometry";

type DragStatus = {
  enabled: boolean;
  down: boolean;
  origin: Vec2D;
  offset: Vec2D;
};

type DragListener = (event: DragStatus) => void;

export default function useDrag<E extends HTMLElement = HTMLElement>(
  onDrag: DragListener,
  enable: boolean = true
) {
  const element = useRef<E>(null);
  const dragStatus = useRef<DragStatus>({
    enabled: false,
    down: false,
    origin: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  });
  dragStatus.current.enabled = enable;

  return useMemo(
    () => ({
      ref: element,
      onPointerDown: (event: React.PointerEvent) => {
        if (dragStatus.current.enabled && event.button === 0) {
          dragStatus.current.down = true;
          dragStatus.current.origin = { x: event.pageX, y: event.pageY };
          dragStatus.current.offset = { x: 0, y: 0 };
          element.current!.setPointerCapture(event.pointerId);
          onDrag(dragStatus.current);
        }
      },
      onPointerMove: (event: React.PointerEvent) => {
        if (dragStatus.current.enabled && dragStatus.current.down) {
          const { pageX: x, pageY: y } = event;
          const newOffset = vecSub({ x, y }, dragStatus.current.origin);
          dragStatus.current.offset = newOffset;
          onDrag(dragStatus.current);
        }
      },
      onPointerUp: (event: React.PointerEvent) => {
        if (dragStatus.current.enabled && event.button === 0) {
          element.current!.releasePointerCapture(event.pointerId);
          dragStatus.current.down = false;
          onDrag(dragStatus.current);
        }
      },
    }),
    [onDrag]
  );
}
