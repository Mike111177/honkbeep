import { vecSub } from "../../../util/Geometry";
import { DragListener } from "../types/DragTypes";
import { GestureStatus } from "../types/GestureTypes";

export default function DragRecognizer(
  onDrag: DragListener,
  status: React.MutableRefObject<GestureStatus>
) {
  return {
    onPointerDown: (event: React.PointerEvent) => {
      if (status.current.config.drag!.enable && event.button === 0) {
        status.current.gestures.drag!.down = true;
        status.current.gestures.drag!.origin = {
          x: event.pageX,
          y: event.pageY,
        };
        status.current.gestures.drag!.offset = { x: 0, y: 0 };
        status.current.element!.setPointerCapture(event.pointerId);
        onDrag(status.current.gestures.drag!);
      }
    },
    onPointerMove: (event: React.PointerEvent) => {
      if (
        status.current.config.drag!.enable &&
        status.current.gestures.drag!.down
      ) {
        const { pageX: x, pageY: y } = event;
        const newOffset = vecSub(
          { x, y },
          status.current.gestures.drag!.origin
        );
        status.current.gestures.drag!.offset = newOffset;
        onDrag(status.current.gestures.drag!);
      }
    },
    onPointerUp: (event: React.PointerEvent) => {
      if (status.current.config.drag!.enable && event.button === 0) {
        status.current.element!.releasePointerCapture(event.pointerId);
        status.current.gestures.drag!.down = false;
        onDrag(status.current.gestures.drag!);
      }
    },
  };
}
