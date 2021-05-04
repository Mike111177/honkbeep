import produce, { Draft } from "immer";
import {
  GameEvent,
  GameEventType,
  doesClueMatchCard,
  reduceGameEventFn,
  initGameStateFromDefinition,
  Variant,
  GamePlayResultType,
} from "../../game";
import * as ArrayUtil from "../../util/ArrayUtil";
import { TurnState } from "../states/TurnState";
import { LocationType } from "../types/Location";

function updateHandLocations(state: Draft<TurnState>, player: number) {
  for (const [slot, card] of state.hands[player].entries()) {
    const meta = state.cardMeta[card];
    if (meta !== undefined) {
      meta.location = {
        place: LocationType.Hand,
        player,
        slot,
      };
    }
  }
}

/**
 * Update non-gamestate critical information, including empathy
 * @param state
 * @param event
 */
function updateMetadata(
  state: Draft<TurnState>,
  event: GameEvent,
  variant: Variant
) {
  const { deck } = variant;

  switch (event.type) {
    case GameEventType.Deal: {
      //Update location of dealt cards
      for (const [player] of state.hands.entries()) {
        updateHandLocations(state, player);
      }
      break;
    }
    case GameEventType.Play: {
      //Update locations of cards still in player hand
      const player = (event.turn - 1) % variant.numPlayers;
      updateHandLocations(state, player);
      //Update location of played card
      switch (event.result) {
        case GamePlayResultType.Success: {
          state.cardMeta[event.card].location = {
            place: LocationType.Stack,
            stack: event.stack,
          };
          break;
        }
        case GamePlayResultType.Misplay: {
          state.cardMeta[event.card].location = {
            place: LocationType.Discard,
            order: state.discardPile.length - 1,
          };
          break;
        }
      }
      break;
    }
    case GameEventType.Discard: {
      //Update locations of cards still in player hand
      const player = (event.turn - 1) % variant.numPlayers;
      updateHandLocations(state, player);
      //Update location of played card
      state.cardMeta[event.card].location = {
        place: LocationType.Discard,
        order: state.discardPile.length - 1,
      };
      break;
    }
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
          touched === doesClueMatchCard(clue, deck.faces[i]);

        {
          // Update clue empathy
          const possible = meta.cluedPossibleCards.filter(cardFilter);
          if (possible.length < meta.cluedPossibleCards.length) {
            //Update possible Cards
            meta.cluedPossibleCards = possible;
            //Update suit pips
            const suits = [...new Set(possible.map((i) => deck.faces[i].suit))];
            if (suits.length < meta.cluedPips.suits.length) {
              meta.cluedPips.suits = suits;
            }
            //Update rank pips
            const ranks = [...new Set(possible.map((i) => deck.faces[i].rank))];
            if (ranks.length < meta.cluedPips.ranks.length) {
              meta.cluedPips.ranks = ranks;
            }
          }
        }

        meta.deducedPossibleCards = meta.deducedPossibleCards.filter(
          cardFilter
        );
      }
      break;
    }
  }
}

export const reduceTurnEvent = produce(
  (state: Draft<TurnState>, event: GameEvent, variant: Variant) => {
    //Update gamestate from new event
    reduceGameEventFn(state, event, variant);
    //Update Metadata
    updateMetadata(state, event, variant);
  }
);

export function initTurnState(variant: Variant): TurnState {
  const game = initGameStateFromDefinition(variant);
  return {
    ...game,
    cardMeta: ArrayUtil.fill(variant.deck.length, () => ({
      location: { place: LocationType.Deck },
      touched: false,
      clues: [],
      cluedPossibleCards: ArrayUtil.iota(variant.deck.faces.length),
      cluedPips: {
        suits: Array.from(variant.suits),
        ranks: ArrayUtil.iota(5, 1),
      },
      deducedPossibleCards: ArrayUtil.iota(variant.deck.faces.length),
      deducedPips: {
        suits: Array.from(variant.suits),
        ranks: ArrayUtil.iota(5, 1),
      },
    })),
  };
}
