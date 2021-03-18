/**
 * Makes an array with ascending numbers at a requested length. Provide a starting value to offset the first value.
 * @param {number} length Length of array
 * @param {number} [start=0] Initial value
 * @returns {number} Array with ascending numbers
 */
function iota(length: number, start:number = 0): number[] {
  const arr = [...Array(length).keys()];
  if (start > 0) return arr.map(i => i + start);
  else return arr;
}

/**
 * Creates an array at requested length, filled with a provided value.
 * You can also provide a factory function for the value parameter.
 * @template T
 * @param {number} length Requested length
 * @param {(T | (i:number)=>T)} value Item to fill array with or a factory function
 * @returns {T[]} Array filled with requested values
 */
function fill<T>(length: number, value: (i:number)=>T): T[];
function fill<T>(length: number, value: T): T[];
function fill(length: number, value: any): any[] {
  if (typeof value === "function") {
    let fn = value as () => any;
    return iota(length).map(fn);
  } else {
    return iota(length).map(() => value);
  }
}

const ArrayUtil = {
  iota,
  fill,
};

export default ArrayUtil;
