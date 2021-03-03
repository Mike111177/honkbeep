import { ClueType } from "./GameTypes";
import { doesClueMatchCard } from "./Rules";

describe("doesClueMatchCard helper", () => {
  test("Clue correctly matches number clues", () => {
    expect(doesClueMatchCard({ type: ClueType.Number, number: 1 }, { suit: "Red", rank: 1 })).toBe(true);
    expect(doesClueMatchCard({ type: ClueType.Number, number: 1 }, { suit: "Purple", rank: 2 })).toBe(false);
  });

  test("Clue correctly matches color clues", () => {
    expect(doesClueMatchCard({ type: ClueType.Color, color: "Red" }, { suit: "Red", rank: 1 })).toBe(true);
    expect(doesClueMatchCard({ type: ClueType.Color, color: "Red" }, { suit: "Purple", rank: 2 })).toBe(false);
  });
});

