import { genericSampleGame } from "./GenericData";
import resolveGameAttempt from "./resolveGameAttempt";
import { ClueType } from "./types/Clue";
import { GameEventType, GamePlayResultType } from "./types/GameEvent";

test("Plays on attempt to play playable card", () => {
  const { state1, order, variant } = genericSampleGame();
  const result = resolveGameAttempt(
    { type: GameEventType.Play, card: 0 },
    state1,
    variant,
    order
  );
  expect(result).toStrictEqual({
    type: GameEventType.Play,
    card: 0,
    result: GamePlayResultType.Success,
    stack: 0,
    turn: 1,
  });
});

test("Misplays on attempt to play non-playable card", () => {
  const { state1, order, variant } = genericSampleGame();
  const result = resolveGameAttempt(
    { type: GameEventType.Play, card: 3 },
    state1,
    variant,
    order
  );
  expect(result).toStrictEqual({
    type: GameEventType.Play,
    card: 3,
    result: GamePlayResultType.Misplay,
    turn: 1,
  });
});

test("Touches correct cards with clues", () => {
  const { state1, order, variant } = genericSampleGame();
  const result = resolveGameAttempt(
    {
      type: GameEventType.Clue,
      clue: { type: ClueType.Color, value: "Green" },
      target: 2,
    },
    state1,
    variant,
    order
  );
  expect(result).toStrictEqual({
    type: GameEventType.Clue,
    clue: { type: ClueType.Color, value: "Green" },
    target: 2,
    touched: [8, 11],
    turn: 1,
  });
});

test("Does not allow invalid clue", () => {
  const { state1, order, variant } = genericSampleGame();
  const result = resolveGameAttempt(
    {
      type: GameEventType.Clue,
      clue: { type: ClueType.Color, value: "Purple" },
      target: 2,
    },
    state1,
    variant,
    order
  );
  expect(result).toStrictEqual(undefined);
});

test("Does not allow self clue", () => {
  const { state1, order, variant } = genericSampleGame();
  const result = resolveGameAttempt(
    {
      type: GameEventType.Clue,
      clue: { type: ClueType.Color, value: "Red" },
      target: 0,
    },
    state1,
    variant,
    order
  );
  expect(result).toStrictEqual(undefined);
});
