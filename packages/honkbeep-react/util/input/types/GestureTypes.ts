import { MutableRefObject } from "react";
import useDrag from "../hooks/useDrag";
import { DragStatus } from "./DragTypes";
import { Recognizer } from "./RecognizerTypes";

export type GestureBuilder = {
  [key in keyof Recognizer]: Required<Recognizer>[key][];
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

export type GestureRef = MutableRefObject<GestureStatus>;
