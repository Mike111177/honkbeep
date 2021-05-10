import { User } from "honkbeep-protocol/types/User";
import { VariantDefinition } from "honkbeep-game";
import { UID } from "honkbeep-util/rng";
import { GameInstanceManager } from "../Game/GameInstanceManager";

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
