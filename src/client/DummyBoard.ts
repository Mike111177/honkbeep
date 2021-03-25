import { getShuffledOrder } from "../game/DeckBuilding";
import {
  GameAttempt,
  GameDefinition,
  GameEvent,
  GameEventType,
} from "../game/GameTypes";
import Board from "./Board";
import {
  initBoardState,
  reduceBoardEvent,
  reduceBoardSetPerspective,
  reduceBoardSetShuffle,
} from "./states/BoardState";
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
    const state0 = initBoardState(definition);
    const dealEvent: GameEvent = { turn: 0, type: GameEventType.Deal };
    const { order } = getShuffledOrder(state0.deck.length);
    const state1 = reduceBoardSetPerspective(
      reduceBoardSetShuffle(reduceBoardEvent(state0, dealEvent), order),
      -1
    );
    super(state1);
    this.callback = callback;
  }

  async attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    return true;
  }

  reduceUserAction(action: UserAction) {
    this.callback(action);
  }
}
