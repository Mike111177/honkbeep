import React from "react";

import {GameTracker} from "../game/Game";
import FrontendInterface from "../game/FrontendInterface"
import { GameEvent } from "../game/GameTypes";

type GameStateListener = ()=>void;
export class GameUIInterface implements FrontendInterface{
  #game?: GameTracker;
  #gameStateChangeListeners: GameStateListener[] = [];
  
  bind(game: GameTracker): void {
    this.#game = game;
  }

  //Return method for handslots to attempt to play a card
  useHandSlot(player: number, index: number){}
  getPlayerNames() {return this.#game!.getPlayerNames();}
  getCardsPerHand() {return this.#game!.getHandSize();}
  getCardInHand(player: number, index: number) {return this.#game!.getCardInHand(player, index, this.#game!.turnsProcessed);}
  getSuits() {return this.#game!.getSuits();}
  getStack(index: number){
    return this.#game!.stacks[index];
  }
  getCardDisplayableProps(index: number) { 
    if (this.#game!.isCardRevealed(index)){
      return this.#game!.cards[this.#game!.knownDeckOrder[index]];
    } else {
      return {rank: 6, suit: "Purple"};
    }
  }

  //Anything that changes with gamestate should add a listener here
  //TODO: add unsubcribe Action
  //TODO: split into more specific state change handlers for improved perf
  listenGameStateChange(listener: GameStateListener){
    this.#gameStateChangeListeners.push(listener);
  }
  onGameStateChange(){this.#gameStateChangeListeners.forEach(l=>l());}
  async attemptPlayerAction(action: GameEvent){
    return this.#game!.attemptPlayerAction(action);
  }
}
export const GameUIContext = React.createContext<GameUIInterface>(new GameUIInterface());
