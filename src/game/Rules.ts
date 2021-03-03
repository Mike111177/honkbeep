import { CardData, Clue, ClueType } from "./GameTypes";

export function doesClueMatchCard(clue: Clue, info: CardData) {
  return (
    (clue.type === ClueType.Number && clue.number === info.rank) ||
    (clue.type === ClueType.Color && clue.color === info.suit)
  );
}
