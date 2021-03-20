import produce, { Draft } from "immer";
import {
  GameDefinition,
  GameEventMessage,
  GameEventType,
} from "../../../game/GameTypes";
import { doesClueMatchCard } from "../../../game/Rules";
import {
  GameState,
  initGameStateFromDefinition,
  reduceGameEvent,
} from "../../../game/states/GameState";
import { DeckEmpathy, EmpathyStatus } from "../../../game/types/Empathy";
import ArrayUtil from "../../../util/ArrayUtil";

export type TurnState = {
  readonly game: GameState;
  readonly shuffleOrder: number[];
  readonly empathy: DeckEmpathy;
};

export const reduceTurnMessage = produce(
  (state: Draft<TurnState>, { event, reveals }: GameEventMessage) => {
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
          const cardWasTouched =
            event.touched.findIndex((i) => i === card) !== -1;
          //For every possibility of this card
          for (let i = 0; i < empathy.length; i++) {
            const possibilityMatchesClue = doesClueMatchCard(
              event.clue,
              state.game.deck.cards[i].data
            );
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
  }
);

export function initTurnState(definition: GameDefinition): TurnState {
  const game = initGameStateFromDefinition(definition);
  return {
    game,
    shuffleOrder: [],
    empathy: ArrayUtil.fill(game.deck.length, () =>
      ArrayUtil.fill(game.deck.cards.length, EmpathyStatus.Possible)
    ),
  };
}
