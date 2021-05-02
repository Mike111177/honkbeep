import { GameEventMessage } from "../../backend/types/GameData";

export interface GameClientConnection {
  player: number;
  callback: (e: GameEventMessage) => void;
}
