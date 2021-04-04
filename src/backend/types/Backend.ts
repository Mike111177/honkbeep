import EventEmitter from "events";
import { GameAttempt } from "../../game";
import { GameData } from "./GameData";

//Responsible for tracking canonical server state from clients perspective
//And notifying frontend of state changes
//And allowing frontend to probe or act on server
interface Backend extends EventEmitter {
  onReady(callback: () => void): void;
  currentState(): GameData;
  isReady(): boolean;
  attemptPlayerAction(action: GameAttempt): Promise<boolean>;
}

export default Backend;
