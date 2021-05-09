import { GameAttempt } from "../../game/types/GameEvent";

export const enum UserActionType {
  GameAttempt = 1,
  SetViewTurn,
  Resume,
  StartHypothetical,
  EndHypothetical,
  EditNote,
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

type UserActionStartHypothetical = {
  type: UserActionType.StartHypothetical;
};

type UserActionEndHypothetical = {
  type: UserActionType.EndHypothetical;
};

type UserActionEditNote = {
  type: UserActionType.EditNote;
  card: number;
  content: string;
};

export type UserAction =
  | UserActionGameAttempt
  | UserActionSetViewTurn
  | UserActionResume
  | UserActionStartHypothetical
  | UserActionEndHypothetical
  | UserActionEditNote;

export default UserAction;
