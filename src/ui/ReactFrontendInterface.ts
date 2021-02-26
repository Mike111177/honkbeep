import React from "react";
import EventEmitter from "events";

import GameTracker from "../game/GameTracker";
import BackendInterface from "../game/BackendInterface";
import NullBackend from "../game/NullBackend";
import { GameEvent } from "../game/GameTypes";

export default class ReactUIInterface extends EventEmitter {
  private game: GameTracker;
  private backend: BackendInterface;

  constructor(backend: BackendInterface) {
    super();
    this.setMaxListeners(100);
    this.backend = backend;
    this.game = new GameTracker();
    if (this.backend.isReady()) {
      this.game.init(this.backend.currentState());
      this.game.propagateState(this.backend.currentState());
      this.backend.on("gameStateChanged", () => {
        this.game.propagateState(this.backend.currentState());
        this.emit("game-update");
      });
    }
  }

  //React Facing API
  async attemptPlayerAction(action: GameEvent) {
    return this.backend.attemptPlayerAction(action);
  }

  isPossiblyPlayable(cardIndex: number) { return true }
  isCardRevealed(cardIndex: number) { return this.game.knownDeckOrder[cardIndex] !== undefined }
  useHandSlot(player: number, index: number) { }
  getPlayerNames() { return this.backend.currentState().definition.playerNames }
  getNumberOfPlayers() { return this.backend.currentState().definition.variant.numPlayers }
  getHandSize() { return this.backend.currentState().definition.variant.handSize }
  getCardInHand(player: number, index: number) { return this.game!.getCardInHand(player, index, this.game!.turnsProcessed) }
  getSuits() { return this.backend.currentState().definition.variant.suits }
  getStack(index: number) { return this.game.stacks[index] }
  getDeckSize() { return this.game.cards.length }
  getPlayerHand(player: number) { return this.game.getLatestPlayerHand(player) }
  getCardDisplayableProps(index: number) {
    if (this.isCardRevealed(index)) {
      return this.game.cards[this.game.knownDeckOrder[index]];
    } else {
      return { rank: 6, suit: "Black" };
    }
  }
  isPlayerTurn(player: number) {
    return player === (this.game.turnsProcessed - 1) % this.getNumberOfPlayers();
  }
  getDiscardPile() {
    return this.game.discardPile.map(i => i.index);
  }
}

export const GameUIContext = React.createContext<ReactUIInterface>(new ReactUIInterface(new NullBackend()));
