import { BoardState } from "../../client/states/BoardState";
import { Immutable } from "../../util/HelperTypes";

export type BoardStateUser<T> = (newState: Immutable<BoardState>) => T;
export type BoardStateComparator<T> = (a: T, b: T) => boolean;
