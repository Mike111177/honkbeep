import { GameTracker } from "./Game"
import { GameEvent, GameState } from "./GameTypes";

//GameTracker's exposure to either a local game or a server hosted game
export default interface BackendInterface {
  bind(game: GameTracker): void;
  currentState(): GameState;
  attemptPlayerAction(action: GameEvent): Promise<void>;
}
