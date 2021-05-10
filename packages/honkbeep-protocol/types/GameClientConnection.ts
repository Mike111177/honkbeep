import { GameEventMessage } from "./GameData";

export interface GameClientConnection {
  player: number;
  callback: (e: GameEventMessage) => void;
}
