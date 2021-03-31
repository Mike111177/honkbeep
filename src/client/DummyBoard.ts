import { getShuffledOrder } from "../game/DeckBuilding";
import {
  GameAttempt,
  GameDefinition,
  GameEvent,
  GameEventType,
} from "../game/GameTypes";
import Board from "./Board";
import { BoardState } from "./states/BoardState";
import UserAction from "./types/UserAction";

type UserActionCallback = (action: UserAction) => void;
export default class DummyBoard extends Board {
  private callback: UserActionCallback;
  constructor(
    callback: UserActionCallback,
    definition: GameDefinition = {
      variant: {
        suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
        numPlayers: 4,
        handSize: 4,
      },
      playerNames: ["Alice", "Bob", "Cathy", "Donald"],
    }
  ) {
    super(new BoardState(definition));
    const { order } = getShuffledOrder(this.boardState.deck.length);
    this.boardState
      .setPerspective(-1)
      .setShuffleOrder(order)
      .appendEvent({ turn: 0, type: GameEventType.Deal });
    this.callback = callback;
  }

  async attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    return true;
  }

  reduceUserAction(action: UserAction) {
    this.callback(action);
  }
}
