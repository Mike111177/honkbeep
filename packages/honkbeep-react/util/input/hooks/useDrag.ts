import { useMemo } from "react";
import DragRecognizer from "../recognizers/DragRecognizer";
import { DragConfig, DragListener } from "../types/DragTypes";
import { useGestureStatus } from "./useGestureStatus";

export default function useDrag(
  onDrag: DragListener,
  config: DragConfig = { enable: true }
) {
  const [ref, status] = useGestureStatus({ drag: config });

  return useMemo(
    () => ({
      ref,
      ...DragRecognizer(onDrag, status),
    }),
    [onDrag, ref, status]
  );
}
