import produce, { Draft } from "immer";
import {
  GameState,
  GameEvent,
  GameEventType,
  doesClueMatchCard,
  reduceGameEventFn,
  initGameStateFromDefinition,
  Variant,
  Clue,
  Deck,
} from "../../game";
import * as ArrayUtil from "../../util/ArrayUtil";
import { Pips } from "../types/Empathy";

//Per turn metadata for cards
type CardTurnMetaData = {
  //Was this card touched yes or no
  readonly touched: boolean;
  //Turns where clues that affected this card
  readonly clues: ReadonlyArray<{ turn: number; pos: boolean; clue: Clue }>;
  //Empathy
  readonly cluedPossibleCards: ReadonlyArray<number>;
  readonly cluedPips: Pips;
  readonly deducedPossibleCards: ReadonlyArray<number>;
  readonly deducedPips: Pips;
};

//Additional Per-Turn Metadata that the client attaches to the game sate
export type TurnState = {
  //Metadata for each card
  readonly cardMeta: ReadonlyArray<CardTurnMetaData>;
} & GameState;

/**
 * Update non-gamestate critical information, including empathy
 * @param state
 * @param event
 */
function updateMetadata(state: Draft<TurnState>, event: GameEvent, deck: Deck) {
  switch (event.type) {
    case GameEventType.Clue: {
      const { turn, clue } = event;
      for (const card of state.hands[event.target]) {
        const meta = state.cardMeta[card];
        const touched = event.touched.includes(card);

        //Mark the card as touched if needed
        if (touched) meta.touched = true;
        //Mark that it was clued on this turn
        meta.clues.push({ turn, pos: touched, clue });

        const cardFilter = (i: number) =>
          touched === doesClueMatchCard(clue, deck.cards[i]);

        {
          // Update clue empathy
          const possible = meta.cluedPossibleCards.filter(cardFilter);
          if (possible.length < meta.cluedPossibleCards.length) {
            //Update possible Cards
            meta.cluedPossibleCards = possible;
            //Update suit pips
            const suits = [...new Set(possible.map((i) => deck.cards[i].suit))];
            if (suits.length < meta.cluedPips.suits.length) {
              meta.cluedPips.suits = suits;
            }
            //Update rank pips
            const ranks = [...new Set(possible.map((i) => deck.cards[i].rank))];
            if (ranks.length < meta.cluedPips.ranks.length) {
              meta.cluedPips.ranks = ranks;
            }
          }
        }

        meta.deducedPossibleCards = meta.deducedPossibleCards.filter(
          cardFilter
        );
      }
    }
  }
}

export const reduceTurnEvent = produce(
  (state: Draft<TurnState>, event: GameEvent, variant: Variant) => {
    //Update gamestate from new event
    reduceGameEventFn(state, event, variant);
    //Update Metadata
    updateMetadata(state, event, variant.deck);
  }
);

export function initTurnState(variant: Variant): TurnState {
  const game = initGameStateFromDefinition(variant);
  return {
    ...game,
    cardMeta: ArrayUtil.fill(variant.deck.length, () => ({
      touched: false,
      clues: [],
      cluedPossibleCards: ArrayUtil.iota(variant.deck.cards.length),
      cluedPips: {
        suits: Array.from(variant.suits),
        ranks: ArrayUtil.iota(5, 1),
      },
      deducedPossibleCards: ArrayUtil.iota(variant.deck.cards.length),
      deducedPips: {
        suits: Array.from(variant.suits),
        ranks: ArrayUtil.iota(5, 1),
      },
    })),
  };
}
