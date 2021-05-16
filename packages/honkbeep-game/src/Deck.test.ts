import * as ArrayUtil from "honkbeep-util/ArrayUtil";
import { Deck, createProcuredDeckOrder, buildVariant } from ".";
import { genericVariant } from "./GenericData";

describe("createProcuredOrder", () => {
  test("Creates correct order", () => {
    const deck = buildVariant(genericVariant()).deck;

    let requestedOrder = [
      { rank: 5, suit: "Red" },
      { rank: 5, suit: "Purple" },
      20,
      undefined,
      { rank: 3, suit: "Green" },
      { rank: 2, suit: "Blue" },
      { rank: 1, suit: "Red" },
      { rank: 1, suit: "Red" },
      { rank: 1, suit: "Red" },
      { rank: 2, suit: "Red" },
    ];

    let { order } = createProcuredDeckOrder(deck, requestedOrder);

    //Check we have cards in the requested order
    requestedOrder.forEach((card, i) => {
      const test = expect(deck.getFaceByCard(order[i]));
      if (card !== undefined) {
        test.toStrictEqual(
          typeof card === "number" ? deck.getFaceByCard(card) : card
        );
      }
    });

    //Make sure it is a valid order
    expect(order).toHaveLength(deck.length); //Has the same length as the deck
    expect(order).toStrictEqual(Array.from(new Set(order))); //Every item is unique
    expect(order).toEqual(expect.arrayContaining(ArrayUtil.iota(deck.length))); //Every Item in the deck is accounted for
  });

  test("Throws when bad card requested", () => {
    let deck = new Deck({
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 5,
    });

    let requestedOrder = [
      { rank: 5, suit: "Red" },
      { rank: 7, suit: "Blue" }, // Bad Card
    ];

    expect(() => createProcuredDeckOrder(deck, requestedOrder)).toThrow();
  });

  test("Throws when invalid card index given", () => {
    let deck = new Deck({
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 5,
    });

    let requestedOrder = [
      800, //No 800th card in deck
    ];

    expect(() => createProcuredDeckOrder(deck, requestedOrder)).toThrow();
  });

  test("Throws when card depleted", () => {
    let deck = new Deck({
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 5,
    });

    let requestedOrder = [
      { rank: 5, suit: "Red" },
      { rank: 5, suit: "Red" }, // No more Red 5's
    ];

    expect(() => createProcuredDeckOrder(deck, requestedOrder)).toThrow();
  });
});
