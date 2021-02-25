import { GameTracker } from "./Game";

export default interface FrontendInterface {
  bind(game: GameTracker): void;
  onGameStateChange(): void;
}
