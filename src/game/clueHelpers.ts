import { Card } from ".";
import { Clue, ClueType } from "./types/Clue";

export function doesClueMatchCard(clue: Clue, info: Card) {
  return (
    (clue.type === ClueType.Rank && clue.value === info.rank) ||
    (clue.type === ClueType.Color && clue.value === info.suit)
  );
}
