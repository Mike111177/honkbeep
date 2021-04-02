import { resolveGameAction } from "../game/ActionResolving";
import { getShuffledOrder } from "../game/DeckBuilding";
import { GameAttempt, GameEventType } from "../game/types/GameEvent";
import { BoardState } from "./states/BoardState";
import Board from "./Board";
import { buildVariant, VariantDefinition } from "../game/types/Variant";
import { genericPlayers, genericVariant } from "../game/GenericData";
import { GameDefinition } from "../game/GameTypes";

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
    const event = resolveGameAction(
      action,
      this.boardState.latestTurn,
      this.boardState.definition.variant,
      this.boardState.shuffleOrder
    );
    if (event !== undefined) {
      this.updateBoardState(this.boardState.appendEvent(event));
      return true;
    }
    return false;
  }
}

export function createGenericSolitaireBoard() {
  return new SolitaireBoard(genericVariant());
}
