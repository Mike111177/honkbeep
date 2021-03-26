import ArrayUtil from "./ArrayUtil";

test("Iota", () => {
  expect(ArrayUtil.iota(4)).toStrictEqual([0, 1, 2, 3]);
  expect(ArrayUtil.iota(10)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test("Fill", () => {
  const primitive = 14;
  const getter = () => ({ primitive });
  const reference = getter();

  const primResult = ArrayUtil.fill(4, primitive);
  expect(primResult).toStrictEqual([
    primitive,
    primitive,
    primitive,
    primitive,
  ]);

  const refResult = ArrayUtil.fill(4, reference);
  expect(refResult).not.toBeSet();
  expect(refResult).toHaveLength(4);
  expect(refResult).toHaveUniqueSize(1);
  expect(refResult[0]).toBe(reference);

  const getResult = ArrayUtil.fill(4, getter);
  expect(getResult).toBeSet();
  expect(getResult).toHaveLength(4);
  expect(getResult).toHaveUniqueSize(4);
  expect(getResult).not.toContain(reference);
});

test("remove", () => {
  const myArray = [6, 5, 4, 3, 2, 1, 0];
  ArrayUtil.remove(myArray, 4);
  expect(myArray).toStrictEqual([6, 5, 3, 2, 1, 0]);
  ArrayUtil.remove(myArray, 4);
  expect(myArray).toStrictEqual([6, 5, 3, 2, 1, 0]);
  ArrayUtil.remove(myArray, 1);
  expect(myArray).toStrictEqual([6, 5, 3, 2, 0]);
});

test("shallowCompare", () => {
  const myArray = [6, 5, 4, 3, { a: 1 }, 1, 0];
  expect(ArrayUtil.shallowCompare(myArray, Array.from(myArray))).toStrictEqual(
    true
  );
  expect(
    ArrayUtil.shallowCompare(myArray, [6, 5, 4, 3, { a: 1 }, 1, 0])
  ).toStrictEqual(false);
  expect(ArrayUtil.shallowCompare(myArray, [6])).toStrictEqual(false);
});
