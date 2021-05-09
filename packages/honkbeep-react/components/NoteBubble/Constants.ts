import { PopoverAlign, PopoverPosition } from "react-tiny-popover";

export const Constants = {
  POPOVER_CONTAINER_CLASS_NAME: "react-tiny-popover-container",
  DEFAULT_ALIGN: "center" as PopoverAlign,
  OBSERVER_THRESHOLDS: Array(1000)
    .fill(null)
    .map((_, i) => i / 1000)
    .reverse(),
  DEFAULT_POSITIONS: ["top", "left", "right", "bottom"] as PopoverPosition[],
  EMPTY_CLIENT_RECT: {
    top: 0,
    left: 0,
    bottom: 0,
    height: 0,
    right: 0,
    width: 0,
  } as ClientRect,
} as const;
