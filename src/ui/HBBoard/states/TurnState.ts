import produce, { Draft } from "immer";
import { Deck } from "../../../game/DeckBuilding";
import {
  GameDefinition,
  GameEvent,
  GameEventType,
} from "../../../game/GameTypes";
import { doesClueMatchCard } from "../../../game/Rules";
import {
  GameState,
  initGameStateFromDefinition,
  reduceGameEventFn,
} from "../../../game/states/GameState";
import { DeckEmpathy, EmpathyStatus } from "../../../game/types/Empathy";
import ArrayUtil from "../../../util/ArrayUtil";

export type TurnState = {
  readonly empathy: DeckEmpathy;
} & GameState;

export const reduceTurnEvent = produce(
  (
    state: Draft<TurnState>,
    event: GameEvent,
    deck: Deck,
    definition: GameDefinition
  ) => {
    //Notify gamestate of new event
    reduceGameEventFn(state, event, definition);
    //If it was a clue, update empathy
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
              deck.cards[i].data
            );
            if (cardWasTouched !== possibilityMatchesClue) {
              empathy[i] = EmpathyStatus.KnownNotPossible;
            }
          }
        }
      }
    }
  }
);

export function initTurnState(
  definition: GameDefinition,
  deck: Deck
): TurnState {
  const game = initGameStateFromDefinition(definition);
  return {
    ...game,
    empathy: ArrayUtil.fill(deck.length, () =>
      ArrayUtil.fill(deck.cards.length, EmpathyStatus.Possible)
    ),
  };
}
