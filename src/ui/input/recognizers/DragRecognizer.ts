import { Vec2D, vecSub } from "../../../util/Geometry";
import { DragListener } from "../types/DragTypes";
import { GestureRef } from "../types/GestureTypes";
import { Recognizer } from "../types/RecognizerTypes";

export default function DragRecognizer(
  onDrag: DragListener,
  status: GestureRef
): Recognizer {
  function dragStart(pos: Vec2D) {
    status.current.gestures.drag!.down = true;
    status.current.gestures.drag!.origin = pos;
    status.current.gestures.drag!.offset = { x: 0, y: 0 };
    onDrag(status.current.gestures.drag!);
  }
  function dragMove(pos: Vec2D) {
    const newOffset = vecSub(pos, status.current.gestures.drag!.origin);
    status.current.gestures.drag!.offset = newOffset;
    onDrag(status.current.gestures.drag!);
  }
  function dragEnd() {
    status.current.gestures.drag!.down = false;
    onDrag(status.current.gestures.drag!);
  }
  return {
    onTouchStart: (event) => {
      if (event.touches.length === 1) {
        const { pageX: x, pageY: y } = event.touches[0];
        dragStart({ x, y });
        event.preventDefault();
      }
    },
    onTouchMove: (event) => {
      if (
        status.current.config.drag!.enable &&
        status.current.gestures.drag!.down
      ) {
        const { pageX: x, pageY: y } = event.touches[0];
        dragMove({ x, y });
        event.preventDefault();
      }
    },
    onTouchEnd: (event) => {
      if (status.current.config.drag!.enable) {
        dragEnd();
        event.preventDefault();
      }
    },
    onTouchCancel: (event) => {
      if (status.current.config.drag!.enable) {
        dragEnd();
        event.preventDefault();
      }
    },
    onPointerDown: (event) => {
      if (status.current.config.drag!.enable && event.button === 0) {
        const { pageX: x, pageY: y } = event;
        dragStart({ x, y });
        status.current.element!.setPointerCapture(event.pointerId);
      }
    },
    onPointerMove: (event) => {
      if (
        status.current.config.drag!.enable &&
        status.current.gestures.drag!.down
      ) {
        const { pageX: x, pageY: y } = event;
        dragMove({ x, y });
      }
    },
    onPointerUp: (event) => {
      if (status.current.config.drag!.enable && event.button === 0) {
        status.current.element!.releasePointerCapture(event.pointerId);
        dragEnd();
      }
    },
  };
}
