import { vecAdd, vecMul, vecNorm, vecSub } from "./Vector";

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
