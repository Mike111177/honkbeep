import { GameState } from "../../../game";
import { FloatAreaPath } from "../../util/Floating";

//TODO: This should be replaced at some point with metadata stored along side the card state
export function getCardHome(index: number, game: GameState): FloatAreaPath {
  //Search hands
  for (let h = 0; h < game.hands.length; h++) {
    const hand = game.hands[h];
    for (let c = 0; c < hand.length; c++) {
      if (index === hand[c]) {
        return ["hands", h, c];
      }
    }
  }
  //Search Stacks
  for (let s = 0; s < game.stacks.length; s++) {
    const stack = game.stacks[s];
    for (let c = 0; c < stack.length; c++) {
      if (index === stack[c]) {
        return ["stacks", s];
      }
    }
  }
  //Search discard
  for (let c = 0; c < game.discardPile.length; c++) {
    if (index === game.discardPile[c]) {
      return ["discard", index];
    }
  }

  return ["deck"];
}
