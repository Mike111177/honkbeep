import React from "react";

import {GameTracker} from "../game/Game";
import FrontendInterface from "../game/FrontendInterface"

export class GameUIInterface implements FrontendInterface{
  game?: GameTracker;
  
  bind(game: GameTracker): void {
    this.game = game;
  }

  //Return method for handslots to attempt to play a card
  useHandSlot(player: number, index: number) {
    return ((p: number, i: number) => {
      return () => {

      };
    })(player, index);
  }
  getPlayerNames() {
    return this.game?.state.definition.playerNames ?? ["Alice", "Bob", "Cathy", "Donald", "Emily"];
  }
  getSuits() {
    return this.game?.state.definition.variant.suits ?? ["Red"];
  }
  getCardsPerHand() {
    return this.game?.state.definition.variant.handSize ?? 1;
  }
  getCardInHand(player: number, index: number) {
    if (this.game) {
      return this.game.getCardInHand(player, index, this.game.turn);
    } else {
      return 0;
    }
  }
  getCardDisplayableProps(index: number) {
    if (this.game) {
      if (this.game.shuffledOrder[index]) {
        let info = this.game.cards[this.game.shuffledOrder[index]];
        return info;
      }
    }
    return { rank: 1, suit: "Purple" };
  }
}
export const GameUIContext = React.createContext<GameUIInterface>(new GameUIInterface());
