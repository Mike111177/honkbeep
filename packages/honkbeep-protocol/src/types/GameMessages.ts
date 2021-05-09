import { GameAttempt } from "../../game";
import { GameData, GameEventMessage } from "./GameData";

export const enum GameMessageType {
  GameServerReady = 1,
  GameClientReady,
  GameDataRequest,
  GameDataResponse,
  GameAttemptRequest,
  GameAttemptRejected,
  GameEventNotification,
}

export type GameServerReady = {
  type: GameMessageType.GameServerReady;
  player: number;
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

export type GameAttemptRejected = {
  type: GameMessageType.GameAttemptRejected;
};

export type GameAttemptRequest = {
  type: GameMessageType.GameAttemptRequest;
  action: GameAttempt;
};

export type GameEventNotification = {
  type: GameMessageType.GameEventNotification;
  event: GameEventMessage;
};

export type GameMessage =
  | GameServerReady
  | GameClientReady
  | GameDataRequest
  | GameDataResponse
  | GameAttemptRequest
  | GameAttemptRejected
  | GameEventNotification;
