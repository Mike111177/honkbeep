import {
  genericSampleGame,
  reduceGameEvent,
  GameEventType,
  GameEvent,
  GamePlayResultType,
  ClueType,
} from "..";

test("Cards are dealt in the right order", () => {
  const { variant, state0 } = genericSampleGame();
  const state1 = reduceGameEvent(
    state0,
    { turn: 0, type: GameEventType.Deal },
    variant
  );
  //Make sure there was a state change
  expect(state1).not.toBe(state0);
  //Make sure cards were dealt in the right order
  expect(state1.hands).toStrictEqual([
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
  ]);
  //Make sure top deck is correct
  expect(state1.topDeck).toEqual(16);
});

test("Successful plays are handled correctly", () => {
  const { variant, state1 } = genericSampleGame();
  const playEvent: GameEvent = {
    turn: 1,
    type: GameEventType.Play,
    result: GamePlayResultType.Success,
    card: 0, // Red 1 is known playable
    stack: 0, // On stack 0
  };
  const state2 = reduceGameEvent(state1, playEvent, variant);
  //Make sure there was a state change
  expect(state2).not.toBe(state1);
  //Make sure the stacks changed
  expect(state2.stacks).not.toBe(state1.stacks);
  //Make sure the first stack had the red 1 added
  expect(state2.stacks[0]).not.toBe(state1.stacks[0]);
  expect(state2.stacks[0]).toStrictEqual([0]);
  //Make sure the other stacks were untouched (structure sharing)
  expect(state2.stacks[1]).toBe(state1.stacks[1]);
  expect(state2.stacks[2]).toBe(state1.stacks[2]);
  expect(state2.stacks[3]).toBe(state1.stacks[3]);
  expect(state2.stacks[4]).toBe(state1.stacks[4]);
  //Make sure hand was refilled properly
  expect(state2.hands[0]).not.toBe(state1.hands[0]);
  expect(state2.hands[0]).toStrictEqual([16, 1, 2, 3]);
});

test("Misplays are handled correctly", () => {
  const { variant, state1 } = genericSampleGame();
  const playEvent: GameEvent = {
    turn: 1,
    type: GameEventType.Play,
    result: GamePlayResultType.Misplay,
    card: 3, // Red 2 is known unplayable
  };
  const state2 = reduceGameEvent(state1, playEvent, variant);
  //Make sure there was a state change
  expect(state2).not.toBe(state1);
  //Make sure the card is added to discard pile
  expect(state2.discardPile).not.toBe(state1.discardPile);
  expect(state2.discardPile).toStrictEqual([3]);
  //Make sure hand was refilled properly
  expect(state2.hands[0]).not.toBe(state1.hands[0]);
  expect(state2.hands[0]).toStrictEqual([16, 0, 1, 2]);
});

test("Clues subtract one from the bank", () => {
  const { variant, state1 } = genericSampleGame();
  const clueEvent: GameEvent = {
    turn: 1,
    type: GameEventType.Clue,
    target: 3,
    clue: { type: ClueType.Rank, value: 2 },
    touched: [5],
  };
  const state2 = reduceGameEvent(state1, clueEvent, variant);
  //Make sure there was a state change
  expect(state2).not.toBe(state1);
  //Make sure the clue bank was reduced by 1
  expect(state2.clues).toEqual(state1.clues - 1);
});
