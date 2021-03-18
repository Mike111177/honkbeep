import { GameState } from "./GameState";
import { GameAttempt, GameEvent, GameEventType, GamePlayResultType } from "./GameTypes";
import { doesClueMatchCard } from "./Rules";

function isCardPlayableOnStack(card: number, stackNumber: number, state: Readonly<GameState>, shuffleOrder: readonly number[]) {
  const cardInfo = state.deck.getCard(shuffleOrder[card]);
  const suit = state.definition.variant.suits[stackNumber];
  const stack = state.stacks[stackNumber];
  if (suit === cardInfo.suit) {
    if (stack.length === 0) {
      if (cardInfo.rank === 1) {
        return true;
      }
    } else {
      const { rank } = state.deck.getCard(shuffleOrder[stack[stack.length - 1]]);
      if (rank === cardInfo.rank - 1) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Test if a GameAttempt is valid given a GameState, and return the resulting event if it is
 * @param action reuqested action
 * @param state current gamestate
 * @param shuffleOrder Known deck order
 * @returns Resulting event if attempt was valid, undefined if not
 */
export function resolveGameAction(action: Readonly<GameAttempt>, state: Readonly<GameState>, shuffleOrder: readonly number[]): GameEvent | undefined {
  const player = (state.turn - 1) % state.definition.variant.numPlayers;
  switch (action.type) {
    case GameEventType.Play: {
      //Get the card the player is trying to play
      const { card } = action;
      //Make sure card is actually in player hand
      if (state.hands[player].find(i => i === card) === undefined) return undefined;
      //Try to play card on each stack, until we find one that works
      for (let i = 0; i < state.definition.variant.suits.length; i++) {
        if (isCardPlayableOnStack(card, i, state, shuffleOrder)) {
          return {
            turn: state.turn,
            type: GameEventType.Play,
            result: GamePlayResultType.Success,
            stack: i,
            card: card
          };
        }
      }
      //If it matched no stacks, this is a misplay, it goes to discard
      return {
        turn: state.turn,
        type: GameEventType.Play,
        result: GamePlayResultType.Misplay,
        card: card
      };
    }
    case GameEventType.Discard: {
      //Get the card the player is trying to play
      const { card } = action;
      //Make sure card is actually in player hand
      if (state.hands[player].find(i => i === card) === undefined) return undefined;
      return {
        type: GameEventType.Discard,
        turn: state.turn,
        card,
      };
    }
    case GameEventType.Clue: {
      const { clue, target } = action;
      //Make sure the player they are cluing exist
      if (target >= state.definition.variant.numPlayers) return undefined;
      //Make sure the player they are cluing is not themself
      if (target === player) return undefined;

      //See which cards in target hand get touched
      const targetHand = state.hands[target];
      let touched = targetHand.filter(card => doesClueMatchCard(clue, state.deck.getCard(shuffleOrder[card])));

      //If no cards were touched, this clue is illegal
      if (touched.length === 0) return undefined;

      //Create the cluining
      return {
        turn: state.turn,
        type: GameEventType.Clue,
        clue,
        target,
        touched
      };
    }
    default:
      return undefined; //Invalid event, so obviously not valid attempt
  }
}
