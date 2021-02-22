import React from "react";
import EventEmitter from "events";

import {GameTracker} from "../game/Game";
import FrontendInterface from "../game/FrontendInterface"
import { GameEvent } from "../game/GameTypes";


type GameStateListener = ()=>void;
export class GameUIInterface extends EventEmitter implements FrontendInterface{
  #game?: GameTracker;

  constructor(){
    super();
    this.setMaxListeners(100);
  }
  
  bind(game: GameTracker): void {
    this.#game = game;
  }

  //Return method for handslots to attempt to play a card
  useHandSlot(player: number, index: number){}
  getPlayerNames() {return this.#game!.getPlayerNames();}
  getNumberOfPlayers() {return this.#game!.getNumberOfPlayers();}
  getCardsPerHand() {return this.#game!.getHandSize();}
  getCardInHand(player: number, index: number) {return this.#game!.getCardInHand(player, index, this.#game!.turnsProcessed);}
  getSuits() {return this.#game!.getSuits();}
  getStack(index: number){return this.#game!.stacks[index];}
  getDeckSize() { return this.#game!.getDeckSize(); }
  getCardDisplayableProps(index: number) { 
    if (this.#game!.isCardRevealed(index)){
      return this.#game!.cards[this.#game!.knownDeckOrder[index]];
    } else {
      return {rank: 6, suit: "Black"};
    }
  }
  isPlayerTurn(player:number){
    return player === (this.#game!.turnsProcessed - 1) % this.#game!.getNumberOfPlayers();
  }
  getDiscardPile(){
    return this.#game!.discardPile.map(i=>i.index);
  }

  onGameStateChange(){
    this.emit("game-update");
  }

  async attemptPlayerAction(action: GameEvent){
    return this.#game!.attemptPlayerAction(action);
  }

  //DO NOT CALL FROM OUTSIDE REACT COMPONENT LUL
  // If you need to listen to events outside of a component just call this.on(<event-name>)
  useGameEvent(event:string, callback:GameStateListener){
    // This violates the rule of hooks where useEffect is not supposed to be called outside of a component
    // So don't call it from outside a component lol
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      const removeFunc = () => {this.off("game-update", callback)};
      this.on("game-update", callback);
      return removeFunc;
    });
  }
}
export const GameUIContext = React.createContext<GameUIInterface>(new GameUIInterface());
