import { Immutable } from "../../util/HelperTypes";

export enum ClueType {
  Number = 1,
  Color,
}
export type NumberClue = Immutable<{
  type: ClueType.Number;
  value: number;
}>;

export type ColorClue = Immutable<{
  type: ClueType.Color;
  value: string;
}>;
export type Clue = NumberClue | ColorClue;

export function colorClue(color: string): ColorClue {
  return { type: ClueType.Color, value: color };
}

export function numberClue(number: number): NumberClue {
  return { type: ClueType.Number, value: number };
}
