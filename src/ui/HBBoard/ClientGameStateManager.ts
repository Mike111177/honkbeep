import React, { useContext, useEffect, useState } from "react";
import produce, { Draft } from "immer";
import EventEmitter from "events";

import { GameState, initGameStateFromDefinition, reduceGameEvent } from "../../game/GameState";
import BackendInterface from "../../game/BackendInterface";
import NullBackend from "../../game/NullBackend";
import { GameAttempt, GameData, GameDefinition, GameEventMessage, GameEventType } from "../../game/GameTypes";
import { FloatAreaPath } from "../util/Floating";
import ArrayUtil from "../../util/ArrayUtil";
import { CardEmpathy, DeckEmpathy, EmpathyStatus, Pips } from "../../game/types/Empathy";
import { doesClueMatchCard } from "../../game/Rules";


type ClientState = {
  game: GameState;
  shuffleOrder: number[];
  empathy: DeckEmpathy;
}

function initClientState(definition: GameDefinition) {
  const game = initGameStateFromDefinition(definition);
  const shuffleOrder: number[] = [];
  const empathy = ArrayUtil.fill(game.deck.length, () => ArrayUtil.fill(game.deck.cards.length, EmpathyStatus.Possible));
  return { game, shuffleOrder, empathy };
}

const reduceClientMessage = produce((state: Draft<ClientState>, { event, reveals }: GameEventMessage) => {
  //Notify gamestate of new event
  state.game = reduceGameEvent(state.game, event);
  //If it was a clue, update empathy
  if (event.type === GameEventType.Clue) {
    //For each card in the hand of the clue target player
    for (let card of state.game.hands[event.target]) {
      //Get the current empathy of this card
      let empathy = state.empathy[card];
      //Make sure this isn't already a revealed card
      if (typeof empathy !== "number") {
        const cardWasTouched = event.touched.findIndex(i => i === card) !== -1;
        //For every possibility of this card
        for (let i = 0; i < empathy.length; i++) {
          const possibilityMatchesClue = doesClueMatchCard(event.clue, state.game.deck.cards[i].data);
          if (cardWasTouched !== possibilityMatchesClue) {
            empathy[i] = EmpathyStatus.KnownNotPossible;
          }
        }
      }
    }
  }
  //Process Reveals
  if (reveals) {
    for (let revealedCard of reveals) {
      state.shuffleOrder[revealedCard.deck] = revealedCard.card;
    }
  }
});

function reduceGameStateFromGameData(state: ClientState, data: GameData, max_turn: number = data.events.length) {
  let messages = data.events;
  for (let i = state.game.turn; i < Math.min(messages.length, max_turn); i++) {
    state = reduceClientMessage(state, messages[i]);
  }
  return state;
}

export default class ClientStateManager extends EventEmitter {
  //Game State after Deal Event, blank until Deal event processed
  private initialState?: ClientState;
  //Most recent canonical game state
  private latestState?: ClientState;
  //Game state currently being viewed, this could be the latest state, a replay state or a hypothetical state
  private viewState?: ClientState;
  //Adapter to use to communicate with server
  private backend: BackendInterface;
  
  paused: boolean = false;

  constructor(backend: BackendInterface) {
    super();
    //Many things will be listening to updates from this
    this.setMaxListeners(100);
    this.backend = backend;

    if (!(backend instanceof NullBackend)) {
      //Create new GameState
      const state0 = initClientState(this.backend.currentState().definition);
      //Set the initial state to the turn after the deal
      this.initialState = reduceGameStateFromGameData(state0, this.backend.currentState(), 1);
      //Set the view state and latest state to be the most recent calculable from the Game Event data we have
      this.viewState = this.latestState = reduceGameStateFromGameData(this.initialState, this.backend.currentState());
      //Listen for further game events
      this.backend.on("gameStateChanged", () => {
        this.latestState = reduceGameStateFromGameData(this.latestState!, this.backend.currentState());
        if (!this.paused) {
          this.viewState = this.latestState;
        }
        this.emit("game-update");
      });
    }
  }

  /**
   * `attemptPlayerAction` Triggers a user request to cause a game event
   * @param action action to attempt.
   * @returns {Promise<boolean>} promise that resolves to boolean indicating if action succeeds 
   */
  async attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    return this.backend.attemptPlayerAction(action);
  }

  /**
   * Check if card has been revealed to player yet. This does not include if the value
   * of the card was deduced by empathy, the game must have revealed it by the card being
   * played, misplayed, discarded, or drawn by a different player.
   * @param {number} index index of card
   * @returns {boolean} Whether or not the given card index has been revealed to this player
   */
  isCardRevealed(index: number): boolean {
    return this.latestState!.shuffleOrder[index] !== undefined;
  }

  /**
   * `getPlayerNames` returns the names of the players in this game as an array
   */
  getPlayerNames() {
    return this.backend.currentState().definition.playerNames;
  }

  /**
   * `getMessage` returns a message from the server that triggered a turn or GameEvent
   * @param {number} index turn index of message
   */
  getMessage(index: number) {
    return this.backend.currentState().events[index];
  }

  /**
   * `onReady` runs a given callback one time once the frontend is ready
   *  If the frontend is already ready, the function is run immediately.
   * @param callback 
   */
  onReady(callback: () => void) {
    this.backend.onReady(callback);
  }

  /**
   * `isReady` returns whether or not the frontend is currently ready
   */
  isReady(): boolean {
    return this.backend.isReady();
  }

  /**
   * `getStateOfTurn` returns the game state from any given turn number
   * 
   * Try to avoid excessive calling of this, it has to recalculate the entire game state
   * making this a very expensive operation.
   * 
   * @param {number} turn turn number
   */
  getStateOfTurn(turn: number) {
    return reduceGameStateFromGameData(this.initialState!, this.backend.currentState(), turn);
  }

  /**
   * Given a player name and a turn number, get that players hand on that turn
   * @param {number} player player number
   * @param {number} turn   turn number
   */
  getPlayerHand(player: number, turn: number = this.viewState!.game.turn) {
    return this.getStateOfTurn(turn).game.hands[player];
  }

  /**
   * Gets a card in a slot, in the hand of a player, on a specific turn
   * @param {number} player player number
   * @param {number} slot   slot number
   * @param {number} turn   turn number
   */
  getCardInHand(player: number, slot: number, turn: number) {
    return this.getPlayerHand(player, turn)[slot];
  }

  /**
   * Changes the currently viewed turn
   * @param {number} turn turn number
   */
  setViewTurn(turn: number) {
    this.viewState = this.getStateOfTurn(turn);
    this.emit("game-update");
  }

  /**
   * get the path of a target element for a card in the deck
   * @param index card number
   * @returns path of target home
   * @todo this is slow, find a better way
   */
  getCardHome(index: number): FloatAreaPath {
    //Search hands
    for (let h = 0; h < this.viewState!.game.hands.length; h++) {
      const hand = this.viewState!.game.hands[h];
      for (let c = 0; c < hand.length; c++) {
        if (index === hand[c]) {
          return ["hands", h, c];
        }
      }
    }
    //Search Stacks
    for (let s = 0; s < this.viewState!.game.stacks.length; s++) {
      const stack = this.viewState!.game.stacks[s];
      for (let c = 0; c < stack.length; c++) {
        if (index === stack[c]) {
          return ["stacks", s];
        }
      }
    }
    //Search discard
    for (let c = 0; c < this.viewState!.game.discardPile.length; c++) {
      if (index === this.viewState!.game.discardPile[c]) {
        return ["discard", index];
      }
    }

    return ["deck"];
  }

  /**
   * Runs a given callback whenever the game state changes
   * @param callback callback to run
   * @returns function to unsubscribe
   */
  subscribeToStateChange(callback: () => void) {
    const removeFunc = () => { this.off("game-update", callback) };
    this.on("game-update", callback);
    return removeFunc;
  }

  /**
   * @returns The latest state
   */
  getLatestState(): Readonly<ClientState> {
    return this.latestState!;
  }

  /**
   * @returns The current view state
   */
  getViewState(): Readonly<ClientState> {
    return this.viewState!;
  }

  /**
   * Synchronize viewstate with latest state
   */
  unpause() {
    this.paused = false;
    this.viewState = this.latestState;
    this.emit("game-update");
  }
  /**
   * Desynchronize viewstate with latest state
   */
  pause() {
    this.paused = true;
    this.emit("game-update");
  }

  getPips(empathy: CardEmpathy): Pips {
    const deck = this.latestState!.game.deck;
    const suits = this.latestState!.game.definition.variant.suits;
    
    if (typeof empathy !== "number") {
      return {
        ranks: [1,2,3,4,5].filter((rank) => {
          return empathy.filter((v, i) => {
            return deck.cards[i].data.rank === rank && v !== EmpathyStatus.KnownNotPossible;
          }).length > 0;
        }),
        suits: suits.filter((suit) => {
          return empathy.filter((v, i) => {
            return deck.cards[i].data.suit === suit && v !== EmpathyStatus.KnownNotPossible;
          }).length > 0;
        })
      };
    } else {
      const card = deck.getCard(empathy);
      return {
        ranks: [card.rank],
        suits: [card.suit]
      };
    }
  }
}

export const GameUIContext = React.createContext<ClientStateManager>(new ClientStateManager(new NullBackend()));

export function useClientLatestState(): Readonly<ClientState> {
  const context = useContext(GameUIContext);
  const [latestState, setLatestState] = useState(() => context.getLatestState());
  useEffect(() => context.subscribeToStateChange(() => {setLatestState(context.getLatestState())}), [context]);
  return latestState;
}

export function useClientViewState(): Readonly<ClientState> {
  const context = useContext(GameUIContext);
  const [viewState, setViewState] = useState(() => context.getViewState());
  useEffect(() => context.subscribeToStateChange(() => {setViewState(context.getViewState())}), [context]);
  return viewState;
}
