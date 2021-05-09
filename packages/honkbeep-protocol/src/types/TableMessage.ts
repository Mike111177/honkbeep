import { User } from "./User";

export type TableState = { players: User[]; leader: number };

export const enum TableMessageType {
  TableUpdate = 1,
  TableStartRequest,
  GameStartNotification,
}

export type TableUpdate = {
  type: TableMessageType.TableUpdate;
  state: Partial<TableState>;
};

export type TableStartRequest = {
  type: TableMessageType.TableStartRequest;
};

export type GameStartNotification = {
  type: TableMessageType.GameStartNotification;
  gameid: string;
};

export type TableMessage =
  | TableUpdate
  | TableStartRequest
  | GameStartNotification;
