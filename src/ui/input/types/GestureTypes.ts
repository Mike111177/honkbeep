import useDrag from "../hooks/useDrag";
import { DragStatus } from "./DragTypes";

export type GestureBuilder = {
  [key: string]: any[];
};

export type GestureHandlers = {
  onDrag?: Parameters<typeof useDrag>[0];
  onRightClick?: () => void;
};

export type GestureConfig = {
  drag?: Parameters<typeof useDrag>[1];
};

export type GestureStatus = {
  element?: HTMLElement | null | undefined;
  gestures: {
    drag?: DragStatus;
  };
  config: GestureConfig;
};
