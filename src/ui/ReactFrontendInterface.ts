import React from "react";

import {GameTracker} from "../game/Game";
import FrontendInterface from "../game/FrontendInterface"

export class GameUIInterface implements FrontendInterface{
  #game?: GameTracker;
  
  bind(game: GameTracker): void {
    this.#game = game;
  }

  //Return method for handslots to attempt to play a card
  useHandSlot(player: number, index: number){}
  getPlayerNames() {return this.#game!.getPlayerNames();}
  getCardsPerHand() {return this.#game!.getHandSize();}
  getCardInHand(player: number, index: number) {return this.#game!.getCardInHand(player, index, this.#game!.turn);}
  getSuits() {return this.#game!.getSuits();}
  getCardDisplayableProps(index: number) { 
    if (this.#game!.isCardRevealed(index)){
      return this.#game!.cards[this.#game!.knownDeckOrder[index]];
    } else {
      return {rank: 6, suit: "Purple"};
    }
  }
}
export const GameUIContext = React.createContext<GameUIInterface>(new GameUIInterface());
