import {
  useClientLatestState,
  useClientViewState,
} from "./ClientGameStateManager";
import { useFloatArea } from "../util/Floating";
import { CardTarget } from "./CardFloat";

export default function HBDiscardPile() {
  const viewState = useClientViewState();
  const latestState = useClientLatestState();
  const cards = viewState.game.discardPile;
  const shuffleOrder = latestState.shuffleOrder;

  const ref = useFloatArea(["discardPile"], { dropZone: true });

  //TODO: Fix this..........
  const cardOrder = cards
    .map((index) => ({
      index,
      ...latestState.game.deck.getCard(shuffleOrder[index]),
    }))
    .sort((a, b) =>
      a.suit < b.suit ? -1 : a.suit > b.suit ? 1 : a.rank - b.rank
    )
    .map((i) => i.index);
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
