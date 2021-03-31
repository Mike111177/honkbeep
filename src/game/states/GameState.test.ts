import { createProcuredOrder, Deck } from "../DeckBuilding";
import {
  GameEvent,
  GameEventType,
  GamePlayEvent,
  GamePlayResultType,
} from "../GameTypes";
import { ClueType } from "../types/Clue";
import { initGameStateFromDefinition, reduceGameEvent } from "./GameState";

function makeSampleGame() {
  const definition = {
    variant: {
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 5,
    },
    playerNames: ["Alice", "Bob", "Cathy", "Donald"],
  };
  const deck = new Deck(definition.variant);
  const { order } = createProcuredOrder(deck, [
    { rank: 1, suit: "Red" }, //Player 1
    { rank: 1, suit: "Red" },
    { rank: 1, suit: "Red" },
    { rank: 2, suit: "Red" },
    { rank: 2, suit: "Red" }, //Player 2
    { rank: 3, suit: "Green" },
    { rank: 4, suit: "Purple" },
    { rank: 5, suit: "Red" },
    { rank: 1, suit: "Blue" },
    { rank: 1, suit: "Yellow" }, //Player 3
    { rank: 1, suit: "Green" },
    { rank: 4, suit: "Blue" },
    { rank: 1, suit: "Yellow" },
    { rank: 2, suit: "Green" },
    { rank: 5, suit: "Purple" }, //Player 4
    { rank: 3, suit: "Purple" },
    { rank: 2, suit: "Yellow" },
    { rank: 2, suit: "Green" },
    { rank: 4, suit: "Yellow" },
    { rank: 3, suit: "Red" },
  ]);
  const state0 = initGameStateFromDefinition(definition);
  const state1 = reduceGameEvent(
    state0,
    { turn: 0, type: GameEventType.Deal },
    definition
  );
  return { definition, deck, order, state0, state1 };
}

test("Cards are dealt in the right order", () => {
  const { definition, state0 } = makeSampleGame();
  const state1 = reduceGameEvent(
    state0,
    { turn: 0, type: GameEventType.Deal },
    definition
  );
  //Make sure there was a state change
  expect(state1).not.toBe(state0);
  //Make sure cards were dealt in the right order
  expect(state1.hands).toStrictEqual([
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
  ]);
  //Make sure top deck is correct
  expect(state1.topDeck).toEqual(20);
});

test("Successful plays are handled correctly", () => {
  const { definition, state1 } = makeSampleGame();
  const playEvent: GameEvent = {
    turn: 1,
    type: GameEventType.Play,
    result: GamePlayResultType.Success,
    card: 0, // Red 1 is known playable
    stack: 0, // On stack 0
  };
  const state2 = reduceGameEvent(state1, playEvent, definition);
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
  expect(state2.hands[0]).toStrictEqual([20, 1, 2, 3, 4]);
});

test("Misplays are handled correctly", () => {
  const { definition, state1 } = makeSampleGame();
  const playEvent: GameEvent = {
    turn: 1,
    type: GameEventType.Play,
    result: GamePlayResultType.Misplay,
    card: 3, // Red 2 is known unplayable
  };
  const state2 = reduceGameEvent(state1, playEvent, definition);
  //Make sure there was a state change
  expect(state2).not.toBe(state1);
  //Make sure the card is added to discard pile
  expect(state2.discardPile).not.toBe(state1.discardPile);
  expect(state2.discardPile).toStrictEqual([3]);
  //Make sure hand was refilled properly
  expect(state2.hands[0]).not.toBe(state1.hands[0]);
  expect(state2.hands[0]).toStrictEqual([20, 0, 1, 2, 4]);
});

test("Clues subtract one from the bank", () => {
  const { definition, state1 } = makeSampleGame();
  const clueEvent: GameEvent = {
    turn: 1,
    type: GameEventType.Clue,
    target: 3,
    clue: { type: ClueType.Number, value: 2 },
    touched: [5],
  };
  const state2 = reduceGameEvent(state1, clueEvent, definition);
  //Make sure there was a state change
  expect(state2).not.toBe(state1);
  //Make sure the clue bank was reduced by 1
  expect(state2.clues).toEqual(state1.clues - 1);
});
