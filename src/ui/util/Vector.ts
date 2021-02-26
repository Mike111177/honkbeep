
export type Vec2D = {
  x: number;
  y: number;
};

export function vecAdd(a:Vec2D,b:Vec2D): Vec2D{
  return {
    x: a.x+b.x,
    y: a.y+b.y
  };
}

export function vecSub(a:Vec2D,b:Vec2D): Vec2D{
  return {
    x: a.x-b.x,
    y: a.y-b.y
  };
}

export function vecNorm(a:Vec2D): number{
  return Math.sqrt(a.x*a.x+a.y*a.y);
}

export function vecMul(a: Vec2D, b: number): Vec2D {
  return { x: a.x * b, y: a.y * b };
}
