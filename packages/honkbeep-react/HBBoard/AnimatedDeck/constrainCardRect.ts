import { Rectangle, vecSub } from "honkbeep-util";
/**
 * Translate target coords into local coords and then constrain to boundary
 * @param boundry
 * @param target
 * @returns
 */
export function constrainCardRect(
  { x: bx, y: by, width: bw, height: bh }: Rectangle,
  { x: dx, y: dy, width: dw, height: dh }: Rectangle
): Rectangle {
  const { x: tx, y: ty } = vecSub({ x: dx, y: dy }, { x: bx, y: by });
  return {
    x: tx < 0 ? 0 : tx + dw > bw ? bw - dw : tx,
    y: ty < 0 ? 0 : ty + dh > bh ? bh - dh : ty,
    width: dw,
    height: dh,
  };
}
