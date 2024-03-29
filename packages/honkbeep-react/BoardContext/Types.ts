import { BoardState } from "honkbeep-play";
import { Immutable } from "honkbeep-util";

export type BoardStateUser<T> = (newState: Immutable<BoardState>) => T;
export type BoardStateComparator<T> = (a: T, b: T) => boolean;
