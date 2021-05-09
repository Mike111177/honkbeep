import classNames from "./classNames";
test("classNames without condition", () => {
  expect(classNames("A", "B", "C")).toEqual("A B C");
});

test("classNames with undefined", () => {
  expect(classNames("A", true, "B", undefined, true, "C")).toEqual("A B C");
});

test("classNames with condition", () => {
  expect(classNames("A", true, "B", false, "C")).toEqual("A C");
});
