import { ArrayUtil } from "honkbeep-util";
import { useMemo, useRef } from "react";

export function useMemoizedArray<T>(arr: T[]) {
  const lastArr = useRef(arr);
  lastArr.current = useMemo(
    () =>
      ArrayUtil.shallowCompare(lastArr.current, arr) ? lastArr.current : arr,
    [arr]
  );
  return lastArr.current;
}
