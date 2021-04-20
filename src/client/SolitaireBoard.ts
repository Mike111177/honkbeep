import {
  VariantDefinition,
  GameDefinition,
  buildVariant,
  genericPlayers,
  getShuffledOrder,
  GameEventType,
  GameAttempt,
  genericVariant,
} from "../game";
import Board from "./Board";
import BoardState, { appendEvent } from "./states/BoardState";

export default class SolitaireBoard extends Board {
  constructor(variantDef: VariantDefinition) {
    const definition: GameDefinition = {
      variant: buildVariant(variantDef),
      playerNames: genericPlayers(variantDef),
    };
    const boardState = new BoardState(definition);
    boardState.shuffleOrder = getShuffledOrder(
      boardState.definition.variant.deck.length
    ).order;
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
