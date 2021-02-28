import React from "react";
import EventEmitter from "events";

import GameTracker from "../game/GameTracker";
import BackendInterface from "../game/BackendInterface";
import NullBackend from "../game/NullBackend";
import { GameAttempt, GameEvent } from "../game/GameTypes";

export default class ReactUIInterface extends EventEmitter {
  private tracker: GameTracker;
  private backend: BackendInterface;

  constructor(backend: BackendInterface) {
    super();
    this.setMaxListeners(100);
    this.backend = backend;
    this.tracker = new GameTracker();
    this.backend.onReady(() => {
      this.tracker.init(this.backend.currentState());
      this.tracker.propagateState(this.backend.currentState());
      this.backend.on("gameStateChanged", () => {
        this.tracker.propagateState(this.backend.currentState());
        this.emit("game-update");
      });
    });
  }

  //React Facing API
  async attemptPlayerAction(action: GameAttempt) {
    return this.backend.attemptPlayerAction(action);
  }

  isPossiblyPlayable(cardIndex: number) { return true }
  isCardRevealed(cardIndex: number) { return this.tracker.knownDeckOrder[cardIndex] !== undefined }
  useHandSlot(player: number, index: number) { }
  getPlayerNames() { return this.backend.currentState().definition.playerNames }
  getNumberOfPlayers() { return this.backend.currentState().definition.variant.numPlayers }
  getHandSize() { return this.backend.currentState().definition.variant.handSize }
  getCardInHand(player: number, index: number) { return this.tracker!.getCardInHand(player, index, this.tracker!.turnsProcessed) }
  getSuits() { return this.backend.currentState().definition.variant.suits }
  getStack(index: number) { return this.tracker.stacks[index] }
  getDeckSize() { return this.tracker.cards.length }
  getPlayerHand(player: number) { return this.tracker.getLatestPlayerHand(player) }
  getCardDisplayableProps(index: number) {
    if (this.isCardRevealed(index)) {
      return this.tracker.cards[this.tracker.knownDeckOrder[index]];
    } else {
      return { rank: 6, suit: "Black" };
    }
  }
  isPlayerTurn(player: number) {
    return player === (this.tracker.turnsProcessed - 1) % this.getNumberOfPlayers();
  }
  getDiscardPile() {
    return this.tracker.discardPile.map(i => i.index);
  }

  onReady(callback: () => void) {
    this.backend.onReady(callback);
  }
  isReady(): boolean {
    return this.backend.isReady();
  }
}

export const GameUIContext = React.createContext<ReactUIInterface>(new ReactUIInterface(new NullBackend()));
