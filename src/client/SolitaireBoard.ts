import { resolveGameAction } from "../game/ActionResolving";
import { getShuffledOrder } from "../game/DeckBuilding";
import { GameAttempt, GameDefinition, GameEventType } from "../game/GameTypes";
import { BoardState } from "./states/BoardState";
import Board from "./Board";

export default class SolitaireBoard extends Board {
  constructor(definition: GameDefinition) {
    super(new BoardState(definition));
    const { order } = getShuffledOrder(this.boardState.deck.length);
    this.boardState
      .setPerspective(-1)
      .setShuffleOrder(order)
      .appendEvent({ turn: 0, type: GameEventType.Deal });
  }

  async attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    const event = resolveGameAction(
      action,
      this.boardState.latestTurn,
      this.boardState.deck,
      this.boardState.definition,
      this.boardState.shuffleOrder
    );
    if (event !== undefined) {
      this.boardState.appendEvent(event);
      this.updateBoardState();
      return true;
    }
    return false;
  }
}

export function createGenericSolitaireBoard() {
  const gamedef = {
    variant: {
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 4,
    },
    playerNames: ["Alice", "Bob", "Cathy", "Donald"],
  };
  return new SolitaireBoard(gamedef);
}
