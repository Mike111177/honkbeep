import { Deck, GameDefinition } from "../../game";
import { Immutable } from "../../util/HelperTypes";

export enum EmpathyStatus {
  NotedFor = 0, //Player gave it an elim note
  Possible, //No notion
  NotedAgainst, //Player made a note against it
  NotPossible, //Player knows not possible
  KnownNotPossible, //All players know this isn't possible
}
//Array of possible deck items or index of card
export type CardEmpathy = EmpathyStatus[] | number;
export type DeckEmpathy = CardEmpathy[];
export type Pips = {
  ranks: number[];
  suits: string[];
};

export function getPipsFromEmpathy(
  empathy: Immutable<CardEmpathy>,
  deck: Deck,
  definition: GameDefinition
): Pips {
  const suits = definition.variant.suits;

  if (typeof empathy !== "number") {
    return {
      ranks: [1, 2, 3, 4, 5].filter((rank) => {
        return (
          empathy.filter((v, i) => {
            return (
              deck.cards[i].data.rank === rank &&
              v !== EmpathyStatus.KnownNotPossible
            );
          }).length > 0
        );
      }),
      suits: suits.filter((suit) => {
        return (
          empathy.filter((v, i) => {
            return (
              deck.cards[i].data.suit === suit &&
              v !== EmpathyStatus.KnownNotPossible
            );
          }).length > 0
        );
      }),
    };
  } else {
    const card = deck.getCard(empathy);
    return {
      ranks: [card.rank],
      suits: [card.suit],
    };
  }
}
