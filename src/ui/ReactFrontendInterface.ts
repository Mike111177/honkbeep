import React from "react";
import EventEmitter from "events";

import { GameState, initBlankGameState, reduceGameStateFromGameData } from "../game/GameState";
import BackendInterface from "../game/BackendInterface";
import NullBackend from "../game/NullBackend";
import { GameAttempt } from "../game/GameTypes";

export default class ReactUIInterface extends EventEmitter {
  private readonly initialState = initBlankGameState();
  private latestState: GameState;
  private viewState: GameState;   
  private backend: BackendInterface;

  constructor(backend: BackendInterface) {
    super();
    this.setMaxListeners(100);
    this.backend = backend;
    this.viewState = this.latestState = this.initialState;
    this.backend.onReady(() => {
      this.viewState = this.latestState = reduceGameStateFromGameData(this.latestState, this.backend.currentState());
      this.backend.on("gameStateChanged", () => {
        this.viewState = this.latestState = reduceGameStateFromGameData(this.latestState, this.backend.currentState());
        this.emit("game-update");
      });
    });
  }

  //React Facing API
  async attemptPlayerAction(action: GameAttempt) {
    return this.backend.attemptPlayerAction(action);
  }

  isPossiblyPlayable(cardIndex: number) { return true }
  isCardRevealed(cardIndex: number) { return this.latestState.knownDeckOrder[cardIndex] !== undefined }
  useHandSlot(player: number, index: number) { }
  getPlayerNames() { return this.backend.currentState().definition.playerNames }
  getNumberOfPlayers() { return this.backend.currentState().definition.variant.numPlayers }
  getHandSize() { return this.backend.currentState().definition.variant.handSize }
  getSuits() { return this.backend.currentState().definition.variant.suits }
  getStack(index: number) { return this.latestState.stacks[index] }
  getDeckSize() { return this.latestState.deck.length }

  getCardDisplayableProps(index: number) {
    if (this.isCardRevealed(index)) {
      return this.latestState.deck.getCard(this.latestState.knownDeckOrder[index]);
    } else {
      return { rank: 6, suit: "Black" };
    }
  }
  isPlayerTurn(player: number) {
    return player === (this.viewState.turn - 1) % this.getNumberOfPlayers();
  }
  getDiscardPile() {
    return this.viewState.discardPile;
  }
  getCurrentTurn() {
    return this.viewState.turn;
  }
  getMessage(index: number) {
    return this.backend.currentState().events[index];
  }

  onReady(callback: () => void) {
    this.backend.onReady(callback);
  }

  isReady(): boolean {
    return this.backend.isReady();
  }

  getStateOfTurn(turn: number) {
    return reduceGameStateFromGameData(this.initialState, this.backend.currentState(), turn);
  }
  getPlayerHand(player: number, turn: number = this.viewState.turn) { 
    return this.getStateOfTurn(turn).hands[player];    
  }
  getCardInHand(player: number, index: number, turn: number) {
    return this.getPlayerHand(player, turn)[index];
  }
  setViewTurn(turn: number) {
    this.viewState = this.getStateOfTurn(turn);
    this.emit("game-update");
  }

}

export const GameUIContext = React.createContext<ReactUIInterface>(new ReactUIInterface(new NullBackend()));
