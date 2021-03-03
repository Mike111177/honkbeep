import LocalServer from "./LocalServer";
import { ClueType, GameClueAttempt, GameEventType } from "./GameTypes";

test('Initializes without error', () => {
  const gamedef = {
    variant: {
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 5
    },
    playerNames: ["Alice", "Bob", "Cathy", "Donald"]
  };
  //Create virtual local Server 
  new LocalServer(gamedef);
});


test('Does not allow player to take turn twice in a row', async () => {
  const gamedef = {
    variant: {
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 5
    },
    playerNames: ["Alice", "Bob", "Cathy", "Donald"]
  };
  //Create virtual local Server 
  const server = new LocalServer(gamedef, 0);
  //Test having player 1 make a play 2 times
  expect(await server.attemptPlayerAction(0, { type: GameEventType.Play, handSlot: 0 })).toBe(true);
  expect(await server.attemptPlayerAction(0, { type: GameEventType.Play, handSlot: 0 })).toBe(false);
  //Test having player 2 make a discard 2 times
  expect(await server.attemptPlayerAction(1, { type: GameEventType.Discard, handSlot: 0 })).toBe(true);
  expect(await server.attemptPlayerAction(1, { type: GameEventType.Discard, handSlot: 0 })).toBe(false);
  //Test having player 3 make a clue 2 times
  expect(await server.attemptPlayerAction(2, { type: GameEventType.Clue, target: 0, clue: {type: ClueType.Number, number: 2} })).toBe(true);
  expect(await server.attemptPlayerAction(2, { type: GameEventType.Clue, target: 0, clue: {type: ClueType.Number, number: 1} })).toBe(false);
});

test('Does not allow clues sent to invalid players', async () => {
  const gamedef = {
    variant: {
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 5
    },
    playerNames: ["Alice", "Bob", "Cathy", "Donald"]
  };
  //Create virtual local Server with 4 players
  const server = new LocalServer(gamedef, 0);

  const player1GoodClue: GameClueAttempt = { type: GameEventType.Clue, target: 3, clue: { type: ClueType.Number, number: 2 } };
  const player2BadTClue: GameClueAttempt = { type: GameEventType.Clue, target: 4, clue: { type: ClueType.Number, number: 2 } };
  const player2SelfClue: GameClueAttempt = { type: GameEventType.Clue, target: 1, clue: { type: ClueType.Number, number: 2 } };

  //Test having player 1 make a clue for existing player 4 (index 3)
  expect(await server.attemptPlayerAction(0, player1GoodClue)).toBe(true);
  //Test having player 2 make a clue for non-existant player 5 (index 4)
  expect(await server.attemptPlayerAction(1, player2BadTClue)).toBe(false);
  //Test having player 2 make a clue for themself (illegal move)
  expect(await server.attemptPlayerAction(1, player2SelfClue)).toBe(false);
  //Make sure player 2 can actually give a valid clue
  expect(await server.attemptPlayerAction(1, player1GoodClue)).toBe(true);
  //Make sure that the self clue player 2 would have been valid if it wernt a self clue
  expect(await server.attemptPlayerAction(2, player2SelfClue)).toBe(true);
});
