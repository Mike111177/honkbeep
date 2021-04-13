import { ReactComponent as Circle } from "./Circle.svg";
import { ReactComponent as Triangle } from "./Triangle.svg";
import { ReactComponent as Square } from "./Square.svg";
import { ReactComponent as Pentagon } from "./Pentagon.svg";
import { ReactComponent as Hexagon } from "./Hexagon.svg";
import { ReactComponent as Star } from "./Star.svg";

const Pips: Record<string, typeof Circle> = {
  Square,
  Circle,
  Triangle,
  Pentagon,
  Hexagon,
  Star,
} as const;

type SVGProps = React.SVGProps<SVGSVGElement>;
export type PipProps = {
  pip: string;
  size: SVGProps["height"];
} & Omit<SVGProps, "height" | "width" | "size">;
export function Pip({ pip, size, ...props }: PipProps) {
  const Shape = Pips[pip];
  return (
    <Shape
      width={size}
      height={size}
      stroke="black"
      strokeWidth="5%"
      {...props}
    />
  );
}

const pips: Record<string, string> = {
  Black: "Circle",
  Blue: "Pentagon",
  Brown: "Circle",
  Green: "Square",
  Null: "Circle",
  Omni: "Circle",
  Pink: "Circle",
  Prism: "Circle",
  Purple: "Hexagon",
  Rainbow: "Circle",
  Red: "Circle",
  Teal: "Star",
  White: "Circle",
  Yellow: "Triangle",
};

export default pips;
