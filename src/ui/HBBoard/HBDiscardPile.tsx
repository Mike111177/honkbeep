import { GameUIContext } from "./ClientState";
import { useFloatArea } from "../util/Floating";
import { CardTarget } from "./CardFloat";
import { useContext, useMemo } from "react";

export default function HBDiscardPile() {
  const context = useContext(GameUIContext);
  const [cards, shuffleOrder, deck] = context.useBoardState((boardState) => {
    return [
      boardState.viewTurn.game.discardPile,
      boardState.shuffleOrder,
      boardState.initialTurn.game.deck,
    ];
  });
  const ref = useFloatArea(["discardPile"], { dropZone: true });

  //TODO: Fix this..........
  const cardOrder = useMemo(
    () =>
      cards
        .map((index) => ({
          index,
          ...deck.getCard(shuffleOrder[index]),
        }))
        .sort((a, b) =>
          a.suit < b.suit ? -1 : a.suit > b.suit ? 1 : a.rank - b.rank
        )
        .map((i) => i.index),
    [cards, deck, shuffleOrder]
  );
  return (
    <div
      ref={ref}
      id="discard"
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        justifyContent: "space-evenly",
        alignContent: "center",
      }}
    >
      {cardOrder.map((i) => (
        <CardTarget key={i} areaPath={["discard", i]} />
      ))}
    </div>
  );
}
