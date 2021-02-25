import { RefObject, useState } from "react";
import { vecSub, Vec2D } from "./Vector";

//Configurable Master hook for dealing with user interaction ona component
export type DragStatus = {
  down: boolean;
  origin: Vec2D;
  offset: Vec2D;
}

type DragEventHandler = (s: DragStatus) => any;

export class DragRecognizer<EL extends HTMLElement = HTMLElement> {
  status: DragStatus = {
    down: false,
    origin: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
  }
  listeners = ((rec: DragRecognizer<EL>) => {
    return {
      onPointerDown: (event: React.PointerEvent) => { rec.onPointerDown(event) },
      onPointerUp: (event: React.PointerEvent) => { rec.onPointerUp(event) },
      onPointerMove: (event: React.PointerEvent) => { rec.onPointerMove(event) }
    };
  })(this);
  ref: RefObject<EL>;
  handler: DragEventHandler;

  constructor(ref: RefObject<EL>, eventHandler: DragEventHandler) {
    this.ref = ref;
    this.handler = eventHandler;
  }

  onPointerDown(event: React.PointerEvent) {
    if (event.button === 0) { //Left Click
      this.status.down = true;
      this.status.origin = { x: event.pageX, y: event.pageY };
      this.status.offset = { x: 0, y: 0 };
      this.ref.current!.setPointerCapture(event.pointerId);
      this.handler(this.status);
    }
  }
  onPointerUp(event: React.PointerEvent) {
    if (event.button === 0) { //Left Click
      this.ref.current!.releasePointerCapture(event.pointerId);
      this.status.down = false;
      this.handler(this.status);
    }
  }
  onPointerMove(event: React.PointerEvent) {
    if (this.status.down) {
      const { pageX: x, pageY: y } = event;
      const newOffset = vecSub({ x, y }, this.status.origin);
      this.status.offset = newOffset;
      this.handler(this.status);
    }
  }
}

export function useDrag<EL extends HTMLElement = HTMLElement>(ref: RefObject<EL>, eventHandler: DragEventHandler) {
  const [{ listeners }] = useState(() => new DragRecognizer(ref, eventHandler));
  return listeners;
}
