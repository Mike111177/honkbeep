import LocalServer from "./LocalServer";
import { GameEventType } from "./GameTypes";

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
  const server = new LocalServer(gamedef);
  //Test having player 1 make a play 2 times
  expect(await server.attemptPlayerAction(0, { type: GameEventType.Play, handSlot: 0 })).toBe(true);
  expect(await server.attemptPlayerAction(0, { type: GameEventType.Play, handSlot: 0 })).toBe(false);
});
