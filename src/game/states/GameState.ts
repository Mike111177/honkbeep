import { Draft, enableMapSet, produce } from "immer";

import {
  GameEventType,
  GamePlayResultType,
  GameDefinition,
  GameEvent,
} from "../GameTypes";
import ArrayUtil from "../../util/ArrayUtil";

enableMapSet();

export type CardPile = ReadonlyArray<number>;

export interface GameState {
  readonly turn: number;
  readonly hands: ReadonlyArray<CardPile>;
  readonly stacks: ReadonlyArray<CardPile>;
  readonly discardPile: CardPile;
  readonly topDeck: number;
  readonly clues: number;
  readonly strikes: number;
  readonly cardReveals: ReadonlyArray<ReadonlySet<number>>;
}

export function reduceGameEventFn<T extends Draft<GameState>>(
  state: T,
  event: GameEvent,
  definition: GameDefinition
): void {
  //Process Actions
  let player = (event.turn - 1) % definition.variant.numPlayers;
  switch (event.type) {
    case GameEventType.Deal: {
      //Turn 0, Deal
      state.hands = [];
      for (let p = 0; p < definition.variant.numPlayers; p++) {
        state.hands[p] = [];
        for (let s = 0; s < definition.variant.handSize; s++) {
          state.hands[p].push(state.topDeck);
          //The dealt card gets revealed to everyone but the recipient
          state.cardReveals
            .filter((_, i) => i !== p)
            .forEach((reveals) => reveals.add(state.topDeck));
          state.topDeck++;
        }
      }
      //Advance to next players turn
      state.turn++;
      break;
    }
    case GameEventType.Play: {
      //Note index of card
      const { card } = event;
      //Create copy of current hand to make new hand
      let newHand = Array.from(state.hands[player]);
      //Find card in hand
      const handSlot = newHand.findIndex((i) => i === card);
      //Remove played card from hand
      newHand.splice(handSlot, 1);
      if (event.result === GamePlayResultType.Success) {
        //If it was a successful play, add card to proper stack
        state.stacks[event.stack].push(card);
      } else if (event.result === GamePlayResultType.Misplay) {
        //if it was a missplay put it in the discard pile
        state.discardPile.push(card);
        //Also bomb
        state.strikes++;
      }
      //Put card on top of deck in leftmost slot
      newHand.unshift(state.topDeck);
      //Update the players hand
      state.hands[player] = newHand;
      //the played card gets revealed to the player
      state.cardReveals[player].add(card);
      //The card at the top of the deck gets revealed to everyone else
      state.cardReveals
        .filter((_, i) => i !== player)
        .forEach((reveals) => reveals.add(state.topDeck));
      //Mark off another from the deck
      state.topDeck++;
      //Advance to next players turn
      state.turn++;
      break;
    }
    case GameEventType.Discard: {
      //Note index of card
      const { card } = event;
      //Create copy of current hand to make new hand
      let newHand = Array.from(state.hands[player]);
      //Find card in hand
      const handSlot = newHand.findIndex((i) => i === card);
      //Remove played card from hand
      newHand.splice(handSlot, 1);
      //Put it in the discard pile
      state.discardPile.push(card);
      //Put card on top of deck in leftmost slot
      newHand.unshift(state.topDeck);
      //Update the players hand
      state.hands[player] = newHand;
      //the played card gets revealed to the player
      state.cardReveals[player].add(card);
      //The card at the top of the deck gets revealed to everyone else
      state.cardReveals
        .filter((_, i) => i !== player)
        .forEach((reveals) => reveals.add(state.topDeck));
      //Mark off another from the deck
      state.topDeck++;
      //Advance to next players turn
      state.turn++;
      //If clue bank not full add clue
      if (state.clues !== 8) state.clues++;
      break;
    }
    case GameEventType.Clue: {
      //Subtract a clue
      state.clues--;
      //Advance to next players turn
      state.turn++;
      break;
    }
  }
}
export const reduceGameEvent = produce(reduceGameEventFn);

export function initGameStateFromDefinition(
  definition: GameDefinition
): GameState {
  return {
    turn: 0,
    hands: [],
    stacks: ArrayUtil.fill(definition.variant.suits.length, () => []),
    discardPile: [],
    topDeck: 0,
    clues: 8,
    strikes: 0,
    cardReveals: ArrayUtil.fill(definition.variant.numPlayers, () => new Set()),
  };
}

export function initNullGameState(): GameState {
  return {
    turn: 0,
    hands: [],
    stacks: [],
    discardPile: [],
    topDeck: 0,
    clues: 8,
    strikes: 0,
    cardReveals: [],
  };
}
