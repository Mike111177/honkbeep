import React from "react";
import EventEmitter from "events";

import { GameTracker } from "../game/Game";
import FrontendInterface from "../game/FrontendInterface";
import { GameEvent } from "../game/GameTypes";

export class GameUIInterface extends EventEmitter implements FrontendInterface {
  private game?: GameTracker;

  constructor() {
    super();
    this.setMaxListeners(100);
  }

  bind(game: GameTracker): void {
    this.game = game;
  }

  //Return method for handslots to attempt to play a card
  useHandSlot(player: number, index: number) { }
  getPlayerNames() { return this.game!.getPlayerNames() }
  getNumberOfPlayers() { return this.game!.getNumberOfPlayers() }
  getCardsPerHand() { return this.game!.getHandSize() }
  getCardInHand(player: number, index: number) { return this.game!.getCardInHand(player, index, this.game!.turnsProcessed) }
  getSuits() { return this.game!.getSuits() }
  getStack(index: number) { return this.game!.stacks[index] }
  getDeckSize() { return this.game!.getDeckSize() }
  getPlayerHand(player: number){return this.game!.getLatestPlayerHand(player)}
  getCardDisplayableProps(index: number) {
    if (this.game!.isCardRevealed(index)) {
      return this.game!.cards[this.game!.knownDeckOrder[index]];
    } else {
      return { rank: 6, suit: "Black" };
    }
  }
  isPlayerTurn(player: number) {
    return player === (this.game!.turnsProcessed - 1) % this.game!.getNumberOfPlayers();
  }
  getDiscardPile() {
    return this.game!.discardPile.map(i => i.index);
  }

  onGameStateChange() {
    this.emit("game-update");
  }

  async attemptPlayerAction(action: GameEvent) {
    return this.game!.attemptPlayerAction(action);
  }
}
export const GameUIContext = React.createContext<GameUIInterface>(new GameUIInterface());
