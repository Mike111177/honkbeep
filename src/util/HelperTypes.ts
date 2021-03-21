export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type PickMutable<T, K extends keyof T> = Mutable<Pick<T, K>> &
  Omit<T, K>;
