import { GameState } from "./states/GameState";
import { GameOverCondition } from "./types/GameEvent";
import Variant from "./types/Variant";

export function isGameOver<T extends GameState>(
  { stacks, strikes, topDeck }: T,
  { deck, numPlayers }: Variant
):
  | GameOverCondition.LastTurn
  | GameOverCondition.Strikeout
  | GameOverCondition.Win
  | undefined {
  if (strikes >= 3) return GameOverCondition.Strikeout;
  if (stacks.every((stack) => stack.length === 5)) return GameOverCondition.Win;
  if (topDeck >= deck.length - 1 - numPlayers)
    return GameOverCondition.LastTurn;
}
