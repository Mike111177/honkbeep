export const enum LocationType {
  Deck = 0,
  Hand,
  Stack,
  Discard,
  Hole,
}
type DeckLocation = {
  place: LocationType.Deck;
};
type HandLocation = {
  place: LocationType.Hand;
  player: number;
  slot: number;
};
type StackLocation = {
  place: LocationType.Stack;
  stack: number;
};
type DiscardLocation = {
  place: LocationType.Discard;
  order: number;
};
type HoleLocation = {
  place: LocationType.Hole;
};

export type Location = Readonly<
  DeckLocation | HandLocation | StackLocation | DiscardLocation | HoleLocation
>;
