import { User } from "../backend/types/User";
import { VariantDefinition } from "../game";
import { UID } from "../util/rng";
import { GameInstanceManager } from "./GameInstanceManager";

const ActiveGames = new Map<string, GameInstanceManager>();

export function startNewGame(players: User[], variant: VariantDefinition) {
  const game = new GameInstanceManager(players, variant);
  const id = UID();
  ActiveGames.set(id, game);
  return id;
}

export function getActiveGame(id: string) {
  return ActiveGames.get(id);
}
