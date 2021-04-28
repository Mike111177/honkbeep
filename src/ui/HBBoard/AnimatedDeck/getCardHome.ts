import { GameState } from "../../../game";
import { ZonePath } from "../../Zone";

//May as well store this as a const
const deckPath: ZonePath = ["deck"];

//TODO: This should be replaced at some point with metadata stored along side the card state
export function getCardHome(
  card: number,
  { stacks, hands, discardPile, topDeck }: GameState
): ZonePath {
  //Check if in deck
  if (card >= topDeck) return deckPath;

  //Search hands
  for (let h = 0; h < hands.length; h++) {
    const hand = hands[h];
    //Search this hand
    const handIndex = hand.indexOf(card);
    if (handIndex !== -1) return ["hands", h, handIndex];
  }

  //Search Stacks
  const stackIndex = stacks.findIndex((stack) => stack.includes(card));
  if (stackIndex !== -1) return ["stacks", stackIndex];

  //Search discard
  const discardIndex = discardPile.indexOf(card);
  if (discardIndex !== -1) return ["discard", discardIndex];

  //Pretend in deck if cant be found anywhere else
  return deckPath;
}
