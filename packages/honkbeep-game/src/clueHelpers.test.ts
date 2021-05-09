import { ClueType, doesClueMatchCard } from ".";

describe("doesClueMatchCard helper", () => {
  test("Clue correctly matches number clues", () => {
    expect(
      doesClueMatchCard(
        { type: ClueType.Rank, value: 1 },
        { suit: "Red", rank: 1 }
      )
    ).toBe(true);
    expect(
      doesClueMatchCard(
        { type: ClueType.Rank, value: 1 },
        { suit: "Purple", rank: 2 }
      )
    ).toBe(false);
  });

  test("Clue correctly matches color clues", () => {
    expect(
      doesClueMatchCard(
        { type: ClueType.Color, value: "Red" },
        { suit: "Red", rank: 1 }
      )
    ).toBe(true);
    expect(
      doesClueMatchCard(
        { type: ClueType.Color, value: "Red" },
        { suit: "Purple", rank: 2 }
      )
    ).toBe(false);
  });
});
