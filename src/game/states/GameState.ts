import { Draft, produce } from "immer";

import {
  GameEventType,
  GamePlayResultType,
  GameDefinition,
  GameEvent,
} from "../GameTypes";
import { Deck } from "../DeckBuilding";

export type CardPile = ReadonlyArray<number>;

export type GameState = {
  readonly deck: Deck;
  readonly definition: GameDefinition;
  readonly turn: number;
  readonly hands: ReadonlyArray<CardPile>;
  readonly stacks: ReadonlyArray<CardPile>;
  readonly discardPile: CardPile;
  readonly topDeck: number;
  readonly clues: number;
  readonly strikes: number;
};

export const reduceGameEvent = produce(
  (state: Draft<GameState>, event: GameEvent) => {
    //Process Actions
    let player = (event.turn - 1) % state.definition.variant.numPlayers;
    switch (event.type) {
      case GameEventType.Deal: {
        //Turn 0, Deal
        state.hands = [];
        for (let p = 0; p < state.definition.variant.numPlayers; p++) {
          state.hands[p] = [];
          for (let s = 0; s < state.definition.variant.handSize; s++) {
            state.hands[p].push(state.topDeck);
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
        //Mark off another from the deck
        state.topDeck++;
        //Advance to next players turn
        state.turn++;
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
);

export function initGameStateFromDefinition(
  definition: GameDefinition
): GameState {
  return {
    deck: new Deck(definition.variant),
    definition,
    turn: 0,
    hands: [],
    stacks: definition.variant.suits.map<number[]>((_) => []),
    discardPile: [],
    topDeck: 0,
    clues: 8,
    strikes: 0,
  };
}

export function initNullGameState(): GameState {
  return {
    deck: new Deck(),
    definition: {
      playerNames: [],
      variant: { handSize: 0, numPlayers: 0, suits: [] },
    },
    turn: 0,
    hands: [],
    stacks: [],
    discardPile: [],
    topDeck: 0,
    clues: 8,
    strikes: 0,
  };
}
