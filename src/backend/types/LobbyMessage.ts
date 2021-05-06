import { User } from "./User";

export type LobbyState = { players: User[]; leader: number };

export enum LobbyMessageType {
  LobbyUpdate = 1,
  LobbyStartRequest,
  GameStartNotification,
}

export type LobbyUpdate = {
  type: LobbyMessageType.LobbyUpdate;
  state: Partial<LobbyState>;
};

export type LobbyStartRequest = {
  type: LobbyMessageType.LobbyStartRequest;
};

export type GameStartNotification = {
  type: LobbyMessageType.GameStartNotification;
  gameid: string;
};

export type LobbyMessage =
  | LobbyUpdate
  | LobbyStartRequest
  | GameStartNotification;
