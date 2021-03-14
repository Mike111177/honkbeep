import { ComponentPropsWithoutRef, useContext, useEffect, useRef } from "react";
import React from "react";

export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
}

type AreaListener = (event: FloatAreaEvent) => any;
export type FloatAreaPath = [string, ...(number | string)[]];
export enum FloatAreaEventType {
  Register = 1,
  Resize,
  DragEnter,
  DragLeave
}
export type FloatAreaEvent = {
  area: FloatAreaData;
  type: FloatAreaEventType;
};
class FloatAreaData {
  ref?: React.RefObject<HTMLElement>;
  listeners: AreaListener[] = [];

  getRect() {
    const rect = this.ref?.current?.getBoundingClientRect();
    if (rect) {
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    } else {
      return undefined;
    }
  }

  update(reason: FloatAreaEventType) {
    this.listeners.forEach((callback: AreaListener) => callback({ type: reason, area: this }));
  }
}

export class FloatContextData {
  areas: any = {};
  private initialized: boolean = false;
  private getOrCreateArea(path: FloatAreaPath): FloatAreaData {
    let area = this.areas;
    let i = 0;
    //Search recursively along path
    for (i; i < path.length - 1; i++) {
      //If the next link in the path is undefined
      //Create it based on the next path item
      if (area[path[i]] === undefined) {
        switch (typeof path[i + 1]) {
          //If the next path item is a string, we create an object
          case "string":
            area[path[i]] = {};
            break;
          //However if it is a number we prefer to use an array for better lookup perf
          case "number":
            area[path[i]] = [];
            break;
          default:
            throw new Error("Unsupported path variable");
        }
      } else if (area[path[i]] instanceof FloatAreaData) {
        //Do not recurse through a FloatAreaData, this request was malformed
        throw new Error("Area found in middle of path.");
      }
      area = area[path[i]];
    }

    if (area[path[i]] === undefined) {
      //If the last item in the path is undef, we create it now and return it
      const newArea = new FloatAreaData();
      area[path[i]] = newArea;
      return newArea;
    } else if (area[path[i]] instanceof FloatAreaData) {
      //else if the last item in the path is a FloatAreaData, we found it! return it
      return area[path[i]] as FloatAreaData;
    } else {
      //Else the next item is not a valid area, the request was malformed
      throw new Error("Incomplete area path");
    }
  }

  private *allAreas() {
    function* helper(areas: any): Generator<FloatAreaData, void, unknown> {
      for (let child of Object.keys(areas)) {
        if (areas[child] !== undefined) {
          if (areas[child] instanceof FloatAreaData) {
            yield areas[child];
          } else {
            yield* helper(areas[child]);
          }
        }
      }
    }
    yield* helper(this.areas);
  }

  getRect(path: FloatAreaPath) {
    return this.getOrCreateArea(path).getRect();
  }

  private onWindowResize() {
    for (let area of this.allAreas()) {
      if (area.ref !== undefined) {
        area.update(FloatAreaEventType.Resize);
      }
    }
  }

  init() {
    if (!this.initialized) {
      window.addEventListener("resize", this.onWindowResize.bind(this));
      this.initialized = true;
    }
  }

  subscribeToArea(path: FloatAreaPath, callback: AreaListener) {
    const area = this.getOrCreateArea(path);
    area.listeners.push(callback);
    return () => { area.listeners.splice(area.listeners.findIndex((e: AreaListener) => e === callback), 1) };
  }

  registerArea(path: FloatAreaPath, value: any) {
    const area = this.getOrCreateArea(path);
    area.ref = value;
    area.update(FloatAreaEventType.Register);
  }
}

export const FloatContext = React.createContext<FloatContextData>(new FloatContextData());

export function useFloatArea(path: FloatAreaPath) {
  const floatContext = useContext(FloatContext);
  const ref = useRef(null);
  useEffect(() => floatContext.registerArea(path, ref), [floatContext, path, ref]);
  return ref;
}

type FloatAreaProps = {
  areaPath: FloatAreaPath;
} & ComponentPropsWithoutRef<"div">;
export function FloatArea({ areaPath, children, ...props }: FloatAreaProps) {
  return <div ref={useFloatArea(areaPath)} {...props}>{children}</div>;
}
