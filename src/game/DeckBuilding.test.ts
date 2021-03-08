import ArrayUtil from "../util/ArrayUtil";
import { Deck, createProcuredOrder } from "./DeckBuilding";


describe("createProcuredOrder", () => {
  test("Creates correct procedures", () => {
    let deck = new Deck({
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
    requestedOrder.forEach((card, i) => expect(deck.getCard(order[i])).toStrictEqual(typeof card === "number" ? deck.getCard(card) : card));

    //Make sure it is a valid order
    expect(order).toHaveLength(deck.length); //Has the same length as the deck
    expect(order).toBeSet(); //Every item is unique
    expect(order).toEqual(expect.arrayContaining(ArrayUtil.iota(deck.length))); //Every Item in the deck is accounted for
  });

  test("Throws when bad card requested", () => {
    let deck =  new Deck({
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
    let deck = new Deck({
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
    let deck = new Deck({
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

