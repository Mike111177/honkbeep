import { Vec2D, vecMul } from "../util/Vector";

export const CARD_VIEW: Vec2D = { x: 110, y: 150 };
export const CARD_VIEW_MIDPOINT: Vec2D = vecMul(CARD_VIEW, 0.5);
export const CARD_VIEWBOX: string = `0 0 ${CARD_VIEW.x} ${CARD_VIEW.y}`;
