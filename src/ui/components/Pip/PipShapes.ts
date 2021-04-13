import { ReactComponent as Circle } from "./Circle.svg";
import { ReactComponent as Triangle } from "./Triangle.svg";
import { ReactComponent as Square } from "./Square.svg";
import { ReactComponent as Pentagon } from "./Pentagon.svg";
import { ReactComponent as Hexagon } from "./Hexagon.svg";
import { ReactComponent as Star } from "./Star.svg";

export const PipShapes = {
  Square,
  Circle,
  Triangle,
  Pentagon,
  Hexagon,
  Star,
} as const;

export type PipShape = keyof typeof PipShapes;
