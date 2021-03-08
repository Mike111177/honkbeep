function iota(length: number): number[] {
  return [...Array(length).keys()];
}

function fill<T>(length: number, value: ()=>T): T[];
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
