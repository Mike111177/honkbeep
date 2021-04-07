import { reduceGameEvent } from ".";
import { genericSampleGame } from "./GenericData";
import resolveGameAttempt from "./resolveGameAttempt";
import { ClueType } from "./types/Clue";
import GameEvent, {
  GameEventType,
  GamePlayResultType,
} from "./types/GameEvent";

describe("resolve play attempt", () => {
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

  test("Produces no event when attempting to play card not in hand", () => {
    const { state1, order, variant } = genericSampleGame();
    const result = resolveGameAttempt(
      { type: GameEventType.Play, card: 4 },
      state1,
      variant,
      order
    );
    expect(result).toEqual(undefined);
  });
});

describe("resolve discard attempt", () => {
  test("Produces discard events", () => {
    const { state1, order, variant } = genericSampleGame();
    //Make sure the clue bank is not full by giving a clue
    const state2 = reduceGameEvent(
      state1,
      resolveGameAttempt(
        {
          type: GameEventType.Clue,
          clue: { type: ClueType.Color, value: "Green" },
          target: 2,
        },
        state1,
        variant,
        order
      ) as GameEvent,
      variant
    );
    const result = resolveGameAttempt(
      { type: GameEventType.Discard, card: 4 },
      state2,
      variant,
      order
    );
    expect(result).toStrictEqual({
      card: 4,
      turn: 2,
      type: GameEventType.Discard,
    });
  });
  test("Produces no event when attempting to discard card when the clue bank is full", () => {
    const { state1, order, variant } = genericSampleGame();
    const result = resolveGameAttempt(
      { type: GameEventType.Discard, card: 0 },
      state1,
      variant,
      order
    );
    expect(result).toEqual(undefined);
  });
  test("Produces no event when attempting to discard card not in hand", () => {
    const { state1, order, variant } = genericSampleGame();
    //Make sure the clue bank is not full
    const state2 = reduceGameEvent(
      state1,
      resolveGameAttempt(
        {
          type: GameEventType.Clue,
          clue: { type: ClueType.Color, value: "Green" },
          target: 2,
        },
        state1,
        variant,
        order
      ) as GameEvent,
      variant
    );
    const result = resolveGameAttempt(
      { type: GameEventType.Discard, card: 0 },
      state2,
      variant,
      order
    );
    expect(result).toEqual(undefined);
  });
});

describe("resolve clue attempt", () => {
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
});
