import React from "react";
import { Vec2D, vecMul } from "../../util/Vector";

export const OutlineFilter = (
  <defs>
    <filter id="outline">
      <feComponentTransfer>
        <feFuncR type="linear" slope="0" />
        <feFuncG type="linear" slope="0" />
        <feFuncB type="linear" slope="0" />
      </feComponentTransfer>
      <feMorphology operator="dilate" radius="1" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

export const ThickOutlineFilter = (
  <defs>
    <filter id="thickoutline">
      <feComponentTransfer>
        <feFuncR type="linear" slope="0" />
        <feFuncG type="linear" slope="0" />
        <feFuncB type="linear" slope="0" />
      </feComponentTransfer>
      <feMorphology operator="dilate" radius="6" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

const view: Vec2D = { x: 110, y: 150 };
const viewBox: string = `0 0 ${view.x} ${view.y}`;
const mid: Vec2D = vecMul(view, 0.5);

type CardSVGProps = {
  children?: React.ReactNode;
} & React.ComponentProps<"svg">;
export const CardSVG = React.forwardRef<SVGSVGElement, CardSVGProps>(
  function CardSVG({ children, ...props }, ref) {
    return (
      <svg
        ref={ref}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        {...props}
      >
        {children}
      </svg>
    );
  }
);

type CardRectangleProps = {
  background: string;
  border: string;
};
export function CardRectangle({ background, border }: CardRectangleProps) {
  const shape = { x: "5%", y: "5%", width: "90%", height: "90%", rx: "5%" };
  return (
    <>
      <rect {...shape} fill={background} />
      <rect {...shape} fill="none" strokeWidth="4%" stroke="black" />
      <rect {...shape} fill="none" strokeWidth="2.5%" stroke={border} />
    </>
  );
}

export const CardDim = { view, viewBox, mid };
