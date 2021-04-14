import { GameAttempt } from "../../game";
import { GameData } from "./GameData";

//Responsible for tracking canonical server state from clients perspective
//And notifying frontend of state changes
//And allowing frontend to probe or act on server
interface Backend {
  readonly viewOrder: number;
  connect(): Promise<void>;
  currentState(): GameData;
  onChange(callback: () => void): void;
  attemptPlayerAction(action: GameAttempt): Promise<boolean>;
}

export default Backend;
