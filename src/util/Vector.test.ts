import { vecAdd, vecMul, vecNorm, vecSub, vecInRectangle } from "./Vector";

test("Adding vectors", () => {
  expect(vecAdd({ x: 10, y: 20 }, { x: 2, y: -15 })).toStrictEqual({
    x: 12,
    y: 5,
  });
});

test("Subtracting vectors", () => {
  expect(vecSub({ x: 10, y: 20 }, { x: 2, y: -15 })).toStrictEqual({
    x: 8,
    y: 35,
  });
});

test("Get vector norm", () => {
  expect(vecNorm({ x: 10, y: 20 })).toBeCloseTo(22.36);
});
test("Multiply vector", () => {
  expect(vecMul({ x: 10, y: 20 }, 2)).toStrictEqual({ x: 20, y: 40 });
});

test("Check if point in rectangle", () => {
  expect(
    vecInRectangle({ x: 10, y: 10 }, { x: 5, y: 5, width: 10, height: 10 })
  ).toEqual(true);
  expect(
    vecInRectangle({ x: 20, y: 20 }, { x: 5, y: 5, width: 10, height: 10 })
  ).toEqual(false);
});
