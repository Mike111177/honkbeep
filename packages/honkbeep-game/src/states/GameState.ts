import { Draft, enableMapSet, produce } from "immer";
import {
  GameEventType,
  GamePlayResultType,
  GameEvent,
} from "../types/GameEvent";
import { ArrayUtil } from "honkbeep-util";
import Variant from "../types/Variant";

enableMapSet();

export type CardPile = ReadonlyArray<number>;

export interface GameState {
  readonly turn: number;
  readonly hands: ReadonlyArray<CardPile>;
  readonly stacks: ReadonlyArray<CardPile>;
  readonly discardPile: CardPile;
  readonly topDeck: number;
  readonly lastRound: number;
  readonly clues: number;
  readonly strikes: number;
  readonly cardReveals: ReadonlyArray<ReadonlySet<number>>;
}

function drawCard<T extends Draft<GameState>>(
  state: T,
  { deck, numPlayers }: Variant
) {
  if (deck.length - state.topDeck >= 0) {
    const card = state.topDeck;
    state.topDeck++;
    return card;
  } else {
    if (state.lastRound < 0) {
      state.lastRound = numPlayers - 1;
    }
    return undefined as unknown as number;
  }
}

export function reduceGameEventFn<T extends Draft<GameState>>(
  state: T,
  event: GameEvent,
  variant: Variant
): void {
  //Process Actions
  let player = (event.turn - 1) % variant.numPlayers;
  switch (event.type) {
    case GameEventType.Deal: {
      //Turn 0, Deal
      state.hands = [];
      for (let p = 0; p < variant.numPlayers; p++) {
        state.hands[p] = [];
        for (let s = 0; s < variant.handSize; s++) {
          const newCard = drawCard(state, variant);
          state.hands[p].push(newCard);
          //The dealt card gets revealed to everyone but the recipient
          state.cardReveals
            .filter((_, i) => i !== p)
            .forEach((reveals) => reveals.add(newCard));
        }
      }
      //Advance to next players turn
      state.turn++;
      state.lastRound--;
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
      const newCard = drawCard(state, variant);
      newHand.unshift(newCard);
      //Update the players hand
      state.hands[player] = newHand;
      //the played card gets revealed to the player
      state.cardReveals[player].add(card);
      //The card at the top of the deck gets revealed to everyone else
      state.cardReveals
        .filter((_, i) => i !== player)
        .forEach((reveals) => reveals.add(newCard));
      //Advance to next players turn
      state.turn++;
      state.lastRound--;
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
      const newCard = drawCard(state, variant);
      newHand.unshift(newCard);
      //Update the players hand
      state.hands[player] = newHand;
      //the played card gets revealed to the player
      state.cardReveals[player].add(card);
      //The card at the top of the deck gets revealed to everyone else
      state.cardReveals
        .filter((_, i) => i !== player)
        .forEach((reveals) => reveals.add(newCard));
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
      state.lastRound--;
      break;
    }
  }
}
export const reduceGameEvent = produce(reduceGameEventFn);

export function initGameStateFromDefinition(variant: Variant): GameState {
  return {
    turn: 0,
    lastRound: -1,
    hands: [],
    stacks: ArrayUtil.fill(variant.suits.length, () => []),
    discardPile: [],
    topDeck: 0,
    clues: 8,
    strikes: 0,
    cardReveals: ArrayUtil.fill(variant.numPlayers, () => new Set()),
  };
}

export function initNullGameState(): GameState {
  return {
    turn: 0,
    lastRound: -1,
    hands: [],
    stacks: [],
    discardPile: [],
    topDeck: 0,
    clues: 8,
    strikes: 0,
    cardReveals: [],
  };
}
