import produce, { Draft } from "immer";
import {
  GameState,
  GameEvent,
  GameEventType,
  doesClueMatchCard,
  reduceGameEventFn,
  initGameStateFromDefinition,
  Variant,
} from "../../game";
import * as ArrayUtil from "../../util/ArrayUtil";
import { DeckEmpathy, EmpathyStatus } from "../types/Empathy";

//Per turn metadata for cards
type CardTurnMetaData = {
  readonly touched: boolean;
};

//Additional Per-Turn Metadata that the client attaches to the game sate
export type TurnState = {
  readonly empathy: DeckEmpathy;
  //Metadata for each card
  readonly cardMeta: CardTurnMetaData[];
} & GameState;

function reduceMetaDataFn(state: Draft<TurnState>, event: GameEvent) {
  //Currently we only understand clues
  if (event.type === GameEventType.Clue) {
    for (let card of event.touched) {
      state.cardMeta[card].touched = true;
    }
  }
}

function reduceEmpathyFn(
  state: Draft<TurnState>,
  event: GameEvent,
  { deck }: Variant
) {
  //Currently we only understand clues
  if (event.type === GameEventType.Clue) {
    //For each card in the hand of the clue target player
    for (let card of state.hands[event.target]) {
      //Get the current empathy of this card
      let empathy = state.empathy[card];
      //Make sure this isn't already a revealed card
      if (typeof empathy !== "number") {
        const cardWasTouched =
          event.touched.findIndex((i) => i === card) !== -1;
        //For every possibility of this card
        for (let i = 0; i < empathy.length; i++) {
          const possibilityMatchesClue = doesClueMatchCard(
            event.clue,
            deck.cards[i]
          );
          if (cardWasTouched !== possibilityMatchesClue) {
            empathy[i] = EmpathyStatus.KnownNotPossible;
          }
        }
      }
    }
  }
}

export const reduceTurnEvent = produce(
  (state: Draft<TurnState>, event: GameEvent, variant: Variant) => {
    //Update gamestate from new event
    reduceGameEventFn(state, event, variant);
    //Update Metadata
    reduceMetaDataFn(state, event);
    //Update Empathy
    reduceEmpathyFn(state, event, variant);
  }
);

export function initTurnState(variant: Variant): TurnState {
  const game = initGameStateFromDefinition(variant);
  return {
    ...game,
    empathy: ArrayUtil.fill(variant.deck.length, () =>
      ArrayUtil.fill(variant.deck.cards.length, EmpathyStatus.Possible)
    ),
    cardMeta: ArrayUtil.fill(variant.deck.length, () => ({
      touched: false,
    })),
  };
}
