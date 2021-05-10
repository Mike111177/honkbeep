import * as ArrayUtil from "honkbeep-util/ArrayUtil";
import {
  useRef,
  RefCallback,
  useEffect,
  RefObject,
  MutableRefObject,
  Ref,
} from "react";

type AttachableRef<T> = MutableRefObject<T> | Ref<T>;

type RefRouterState<T> = {
  listeners: AttachableRef<T>[];
  last: React.RefObject<T>;
};

function applyObject<T>(
  ref: AttachableRef<T>,
  object: Parameters<RefCallback<T>>[0]
) {
  if (typeof ref === "function") {
    ref(object);
  } else if (ref != null) {
    (ref as React.MutableRefObject<T | null>).current = object;
  }
}

export function useRefHook<T>(
  router: RefObject<RefRouterState<T>>,
  ref: AttachableRef<T>
) {
  useEffect(() => {
    const { current } = router;
    current!.listeners.push(ref);
    applyObject(ref, router.current!.last.current ?? undefined);
    return () => {
      ArrayUtil.remove(current!.listeners, ref);
    };
  }, [router, ref]);
}

export function useRefRouter<T>(
  initial?: T
): [RefCallback<T>, RefObject<RefRouterState<T>>] {
  const routerState = useRef<RefRouterState<T>>({
    listeners: [],
    last: useRef<T>(initial ?? null),
  });
  return [
    (object) => {
      applyObject(routerState.current.last, object);
      for (const ref of routerState.current.listeners) applyObject(ref, object);
    },
    routerState,
  ];
}
