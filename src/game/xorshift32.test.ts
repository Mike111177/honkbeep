import xorshift32 from "./xorshift32"

test("Gives expected results with input seed", () => {
  const testIter = (seed: number, iter: number) => {
    const gen = new xorshift32(seed);
    for (let i = 0; i < iter; i++) {
      gen.next();
    }
    return gen.next();
  }
  expect(testIter(5, 30)).toEqual(2277783610);
  expect(testIter(23742, 2)).toEqual(2800163681);
  expect(testIter(1345, 70)).toEqual(1963767915);
  expect(testIter(23714678, 22)).toEqual(3880462098);
  expect(testIter(47198754, 122)).toEqual(3011773502);
  expect(testIter(17856, 200)).toEqual(2023840473);
});
