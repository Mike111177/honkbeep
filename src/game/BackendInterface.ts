import EventEmitter from "events";
import { GameAttempt, GameEvent, GameState } from "./GameTypes";

//Responsible for tracking canonical server state from clients perspective
//And notifying frontend of state changes
//And allowing frontend to probe or act on server
interface BackendInterface extends EventEmitter{
  onReady(callback: ()=>void): void;
  currentState(): GameState;
  isReady(): boolean;
  attemptPlayerAction(action: GameAttempt): Promise<boolean>;
}

export default BackendInterface;
