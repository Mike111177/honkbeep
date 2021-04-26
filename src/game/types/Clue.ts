import { Immutable } from "../../util/HelperTypes";
import { Rank } from "./Rank";

export enum ClueType {
  Rank = 1,
  Color,
}

export type RankClue = Immutable<{
  type: ClueType.Rank;
  value: Rank;
}>;

export type ColorClue = Immutable<{
  type: ClueType.Color;
  value: string;
}>;
export type Clue = RankClue | ColorClue;

export function colorClue(color: string): ColorClue {
  return { type: ClueType.Color, value: color };
}

export function rankClue(number: number): RankClue {
  return { type: ClueType.Rank, value: number };
}
