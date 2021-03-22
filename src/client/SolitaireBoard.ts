import { resolveGameAction } from "../game/ActionResolving";
import { getShuffledOrder } from "../game/DeckBuilding";
import {
  GameAttempt,
  GameDefinition,
  GameEvent,
  GameEventType,
} from "../game/GameTypes";
import {
  initBoardState,
  reduceBoardEvent,
  reduceBoardSetPerspective,
  reduceBoardSetShuffle,
} from "./states/BoardState";
import Board from "./Board";

export default class SolitaireBoard extends Board {
  constructor(definition: GameDefinition) {
    const state0 = initBoardState(definition);
    const dealEvent: GameEvent = { turn: 0, type: GameEventType.Deal };
    const { order } = getShuffledOrder(state0.deck.length);
    const state1 = reduceBoardSetPerspective(
      reduceBoardSetShuffle(reduceBoardEvent(state0, dealEvent), order),
      -1
    );
    super(state1);
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
      this.updateBoardState(reduceBoardEvent(this.boardState, event));
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
