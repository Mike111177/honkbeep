import EventEmitter from "events";
import { GameEvent, GameState } from "./GameTypes";

//Responsible for tracking canonical server state from clients perspective
//And notifying frontend of state changes
//And allowing frontend to probe or act on server
interface BackendInterface extends EventEmitter{
  currentState(): GameState;
  isReady(): boolean;
  attemptPlayerAction(action: GameEvent): Promise<boolean>;
}

export default BackendInterface;
