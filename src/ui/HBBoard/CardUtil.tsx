import { Vec2D, vecAdd, vecMul, vecSub } from "../util/Vector";

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

const view: Vec2D = { x: 110, y: 150 };
const viewBox: string = `0 0 ${view.x} ${view.y}`;
const mid: Vec2D = vecMul(view, 0.5);

export const CardDim = { view, viewBox, mid };

