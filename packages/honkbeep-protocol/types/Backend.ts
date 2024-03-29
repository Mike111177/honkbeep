import { GameAttempt } from "honkbeep-game";
import { GameData } from "./GameData";

//Responsible for tracking canonical server state from clients perspective
//And notifying frontend of state changes
//And allowing frontend to probe or act on server
interface Backend {
  readonly viewOrder: number;
  connect(): Promise<void>;
  currentData(): GameData;
  onChange(callback: () => void): void;
  attemptPlayerAction(action: GameAttempt): Promise<boolean>;
  close(): void;
}

export default Backend;
