import { GameAttempt } from "../../game/types/GameEvent";

export enum UserActionType {
  GameAttempt = 1,
  SetViewTurn,
  Resume,
}

type UserActionGameAttempt = {
  type: UserActionType.GameAttempt;
  attempt: GameAttempt;
};

type UserActionSetViewTurn = {
  type: UserActionType.SetViewTurn;
  turn: number;
};

type UserActionResume = {
  type: UserActionType.Resume;
};

export type UserAction =
  | UserActionGameAttempt
  | UserActionSetViewTurn
  | UserActionResume;

export default UserAction;
