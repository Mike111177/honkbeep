import { GameState, Variant } from ".";

export function isCardPlayableOnStack(
  card: number,
  stackNumber: number,
  state: Readonly<GameState>,
  variant: Variant,
  shuffleOrder: readonly number[]
) {
  const cardInfo = variant.deck.getFaceByCard(shuffleOrder[card]);
  const suit = variant.suits[stackNumber];
  const stack = state.stacks[stackNumber];
  if (suit === cardInfo.suit) {
    if (stack.length === 0) {
      if (cardInfo.rank === 1) {
        return true;
      }
    } else {
      const { rank } = variant.deck.getFaceByCard(
        shuffleOrder[stack[stack.length - 1]]
      );
      if (rank === cardInfo.rank - 1) {
        return true;
      }
    }
  }
  return false;
}
