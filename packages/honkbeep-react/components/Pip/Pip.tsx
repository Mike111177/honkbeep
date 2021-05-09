import { PipShape, PipShapes } from ".";

type SVGProps = React.SVGProps<SVGSVGElement>;

export type PipProps = {
  shape: PipShape;
  size: SVGProps["height"];
} & Omit<SVGProps, "height" | "width" | "size">;

export function Pip({ shape, size, ...props }: PipProps) {
  const Shape = PipShapes[shape];
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
