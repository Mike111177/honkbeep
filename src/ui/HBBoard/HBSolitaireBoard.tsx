import { useState } from "react";
import { resolveGameAction } from "../../game/ActionResolving";
import { getShuffledOrder } from "../../game/DeckBuilding";
import {
  GameAttempt,
  GameDefinition,
  GameEvent,
  GameEventType,
} from "../../game/GameTypes";
import HBBoardLayout from "./HBBoardLayout";
import {
  initBoardState,
  reduceBoardEvent,
  reduceBoardSetPerspective,
  reduceBoardSetShuffle,
} from "./states/BoardState";
import { Board } from "./types/BoardContext";

class SolitaireBoard extends Board {
  constructor(definition: GameDefinition) {
    const state0 = initBoardState(definition);
    const dealEvent: GameEvent = { turn: 0, type: GameEventType.Deal };
    const { order } = getShuffledOrder(state0.initialTurn.game.deck.length);
    const state1 = reduceBoardSetPerspective(
      reduceBoardSetShuffle(reduceBoardEvent(state0, dealEvent), order),
      -1
    );
    super(state1);
  }

  async attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    const event = resolveGameAction(
      action,
      this.boardState.latestTurn.game,
      this.boardState.shuffleOrder
    );
    if (event !== undefined) {
      this.boardState = reduceBoardEvent(this.boardState, event);
      this.emit("game-update");
      return true;
    }
    return false;
  }
}

export default function HBSolitaireBoard() {
  const gamedef = {
    variant: {
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 4,
    },
    playerNames: ["Alice", "Bob", "Cathy", "Donald"],
  };
  const [board] = useState(() => new SolitaireBoard(gamedef));
  return <HBBoardLayout board={board} />;
}
