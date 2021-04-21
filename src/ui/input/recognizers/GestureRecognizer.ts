import { GestureBuilder } from "../types/GestureTypes";

export function appendGesture(builder: GestureBuilder, gesture: any) {
  for (const key of Object.getOwnPropertyNames(gesture)) {
    if (builder[key] === undefined) {
      builder[key] = [];
    }
    builder[key].push(gesture[key]);
  }
}

export function GestureRecognizer<T extends GestureBuilder>(
  builder: T
): {
  [Property in keyof T]: () => void;
} {
  const recognizer: any = {};
  for (const key of Object.getOwnPropertyNames(builder)) {
    recognizer[key] = (...args: any) => {
      builder[key].forEach((f) => {
        f(...args);
      });
    };
  }
  return recognizer;
}
