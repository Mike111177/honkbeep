export type Vec2D = {
  x: number;
  y: number;
};

export type Rectangle = {
  width: number;
  height: number;
} & Vec2D;

export function vecAdd(a: Vec2D, b: Vec2D): Vec2D {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

export function vecSub(a: Vec2D, b: Vec2D): Vec2D {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

export function vecNorm(a: Vec2D): number {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

export function vecMul(a: Vec2D, b: number): Vec2D {
  return { x: a.x * b, y: a.y * b };
}

export function vecInRectangle(vec: Vec2D, rect: Rectangle): boolean {
  return (
    rect.x < vec.x &&
    rect.y < vec.y &&
    rect.x + rect.width > vec.x &&
    rect.y + rect.height > vec.y
  );
}
