import { GameData } from "./GameData";

export enum GameMessageType {
  GameServerReady = 1,
  GameClientReady,
  GameDataRequest,
  GameDataResponse,
  GameAttemptRequest,
  GameEventNotification,
}

export type GameServerReady = {
  type: GameMessageType.GameServerReady;
};

export type GameClientReady = {
  type: GameMessageType.GameClientReady;
};

export type GameDataRequest = {
  type: GameMessageType.GameDataRequest;
};

export type GameDataResponse = {
  type: GameMessageType.GameDataResponse;
  data: GameData;
};

export type GameMessage =
  | GameServerReady
  | GameClientReady
  | GameDataRequest
  | GameDataResponse;
