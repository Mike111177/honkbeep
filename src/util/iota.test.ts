import iota from "./iota";

test("Iota", () => {
  expect(iota(4)).toStrictEqual([0, 1, 2, 3]);
  expect(iota(10)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
