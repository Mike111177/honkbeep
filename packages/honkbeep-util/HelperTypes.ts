export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type PickMutable<T, K extends keyof T> = Mutable<Pick<T, K>> &
  Omit<T, K>;

export type Entries<T> = {
  [K in keyof Required<T>]: [K, Required<T>[K]];
}[keyof Required<T>][];

export type ValueFrom<T> = Entries<T>[0][1];

//This may be replaced with a hand rolled one, but this works fine for now
export type { Immutable } from "immer";
