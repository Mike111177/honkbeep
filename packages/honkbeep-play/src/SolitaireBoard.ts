import {
  VariantDefinition,
  genericPlayers,
  getShuffledOrder,
  GameEventType,
  GameAttempt,
  genericVariant,
} from "honkbeep-game";
import { Board } from "./Board";
import BoardState, { appendEvent } from "./states/BoardState";

export class SolitaireBoard extends Board {
  constructor(variantDef: VariantDefinition) {
    const boardState = new BoardState(variantDef, genericPlayers(variantDef));
    boardState.shuffleOrder = getShuffledOrder(
      boardState.variant.deck.length
    ).order;
    boardState.perspective = -1;
    appendEvent(boardState, { turn: 0, type: GameEventType.Deal });
    super(boardState);
  }

  async attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    const event = this.checkMoveValidity(action);
    if (event !== undefined) {
      this.updateBoardState((state) => appendEvent(state, event));
      return true;
    }
    return false;
  }
}

export function createGenericSolitaireBoard() {
  return new SolitaireBoard(genericVariant());
}
