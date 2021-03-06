import iota from "../util/iota";
import { buildDeck, createProcuredOrder } from "./DeckBuilding";


describe("createProcuredOrder", () => {
  test("Creates correct procedures", () => {
    let deck = buildDeck({
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 5
    });

    let requestedOrder = [
      { rank: 5, suit: "Red" },
      { rank: 5, suit: "Purple" },
      20,
      { rank: 2, suit: "Blue" },
      { rank: 3, suit: "Green" },
      { rank: 2, suit: "Blue" }
    ];

    let { order } = createProcuredOrder(deck, requestedOrder);
    
    //Check we have cards in the requested order
    requestedOrder.forEach((card, i) => expect(deck[order[i]]).toStrictEqual(typeof card === "number" ? deck[card] : card));

    //Make sure it is a valid order
    expect(order).toHaveLength(deck.length); //Has the same length as the deck
    expect(order).toHaveLength(new Set<number>(order).size); //Every item is unique
    expect(order).toEqual(expect.arrayContaining(iota(deck.length))); //Every Item in the deck is accounted for
  });

  test("Throws when bad card requested", () => {
    let deck = buildDeck({
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 5
    });

    let requestedOrder = [
      { rank: 5, suit: "Red" },
      { rank: 7, suit: "Blue"} // Bad Card
    ];

    expect(()=>createProcuredOrder(deck, requestedOrder)).toThrow();
  });

  test("Throws when invalid card index given", () => {
    let deck = buildDeck({
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 5
    });

    let requestedOrder = [
      800 //No 800th card in deck
    ];

    expect(()=>createProcuredOrder(deck, requestedOrder)).toThrow();
  });

  test("Throws when card depleted", () => {
    let deck = buildDeck({
      suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
      numPlayers: 4,
      handSize: 5
    });

    let requestedOrder = [
      { rank: 5, suit: "Red" },
      { rank: 5, suit: "Red"} // No more Red 5's
    ];

    expect(()=>createProcuredOrder(deck, requestedOrder)).toThrow();
  });
});

