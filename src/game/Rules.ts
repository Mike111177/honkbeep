import { CardData } from "./GameTypes";
import { Clue, ClueType } from "./types/Clue";

export function doesClueMatchCard(clue: Clue, info: CardData) {
  return (
    (clue.type === ClueType.Number && clue.value === info.rank) ||
    (clue.type === ClueType.Color && clue.value === info.suit)
  );
}
