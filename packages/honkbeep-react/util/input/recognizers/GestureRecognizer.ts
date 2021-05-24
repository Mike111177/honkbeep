import { Entries } from "honkbeep-util";
import { GestureBuilder } from "../types/GestureTypes";
import { Recognizer } from "../types/RecognizerTypes";

export function appendRecognizer(
  builder: GestureBuilder,
  recognizer: Recognizer
) {
  (Object.entries(recognizer) as Entries<Recognizer>).forEach(
    ([name, handler]) => {
      if (builder[name] === undefined) builder[name] = [];
      builder[name]!.push(handler);
    }
  );
}

export function GestureRecognizer<T extends GestureBuilder>(
  builder: T
): Recognizer {
  const recognizer: Recognizer = {};
  //On any given event, run all of the combined handlers in the array
  (Object.entries(builder) as Entries<GestureBuilder>).forEach(
    ([name, handlers]) =>
      (recognizer[name] = (...args: any) =>
        handlers.forEach((f: any) => f(...args)))
  );
  return recognizer;
}
