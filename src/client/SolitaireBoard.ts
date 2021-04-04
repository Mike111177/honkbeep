import {
  VariantDefinition,
  GameDefinition,
  buildVariant,
  genericPlayers,
  getShuffledOrder,
  GameEventType,
  GameAttempt,
  genericVariant,
  resolveGameAttempt,
} from "../game";
import Board from "./Board";
import BoardState from "./states/BoardState";

export default class SolitaireBoard extends Board {
  constructor(variantDef: VariantDefinition) {
    const definition: GameDefinition = {
      variant: buildVariant(variantDef),
      playerNames: genericPlayers(variantDef),
    };
    const boardState = new BoardState(definition);
    const { order } = getShuffledOrder(
      boardState.definition.variant.deck.length
    );
    super(
      boardState
        .setPerspective(-1)
        .setShuffleOrder(order)
        .appendEvent({ turn: 0, type: GameEventType.Deal })
    );
  }

  async attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    const event = resolveGameAttempt(
      action,
      this.state.latestTurn,
      this.state.definition.variant,
      this.state.shuffleOrder
    );
    if (event !== undefined) {
      this.updateBoardState(this.state.appendEvent(event));
      return true;
    }
    return false;
  }
}

export function createGenericSolitaireBoard() {
  return new SolitaireBoard(genericVariant());
}
