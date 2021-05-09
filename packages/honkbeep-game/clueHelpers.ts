import { CardFace } from ".";
import { Clue, ClueType } from "./types/Clue";

export function doesClueMatchCard(clue: Clue, face: CardFace) {
  return (
    (clue.type === ClueType.Rank && clue.value === face.rank) ||
    (clue.type === ClueType.Color && clue.value === face.suit)
  );
}
