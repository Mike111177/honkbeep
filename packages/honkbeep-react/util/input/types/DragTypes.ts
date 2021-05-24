import { Vec2D } from "honkbeep-util";

export type DragStatus = {
  down: boolean;
  origin: Vec2D;
  offset: Vec2D;
};

export function initDragStatus(): DragStatus {
  return {
    down: false,
    origin: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  };
}

export type DragConfig = { enable: boolean };

export type DragListener = (event: DragStatus) => void;
