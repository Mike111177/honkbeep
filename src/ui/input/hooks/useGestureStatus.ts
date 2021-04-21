import { MutableRefObject, useCallback, useRef } from "react";
import { initDragStatus } from "../types/DragTypes";
import { GestureConfig, GestureStatus } from "../types/GestureTypes";

type RefCallback = (instance: HTMLElement | null) => void;

export function useGestureStatus(
  config?: GestureConfig
): [RefCallback, MutableRefObject<GestureStatus>] {
  const status = useRef<GestureStatus>({
    gestures: { drag: initDragStatus() },
    config: {},
  });
  status.current.config = config ?? {};
  const ref = useCallback<RefCallback>((e) => {
    status.current.element = e;
  }, []);
  return [ref, status];
}
