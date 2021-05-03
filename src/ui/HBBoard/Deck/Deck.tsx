import CardTarget from "../AnimatedDeck/CardTarget";
import { useBoardStateSelector, useStaticBoardState } from "../../BoardContext";
import { ZonePath } from "../../Zone";

import styles from "./Deck.css";

const deckPath: ZonePath = ["deck"];

function DrawDeck() {
  const deckSize = useStaticBoardState().variant.deck.length;
  const cardsLeft = useBoardStateSelector(
    ({ viewTurn: { topDeck } }) => deckSize - topDeck + 1,
    [deckSize]
  );
  return (
    <>
      <rect x="5%" y="5%" width="90%" height="90%" fill="#cccccc80" rx="5%" />
      <rect
        x="5%"
        y="5%"
        width="90%"
        height="90%"
        fill="#00000000"
        strokeWidth="4%"
        stroke="#00000080"
        rx="5%"
      />
      <rect
        x="5%"
        y="5%"
        width="90%"
        height="90%"
        fill="#00000000"
        strokeWidth="2.5%"
        stroke="#77777780"
        rx="5%"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#FFFFFF"
        strokeWidth="4"
        stroke="black"
        paintOrder="stroke"
      >
        {cardsLeft}
      </text>
    </>
  );
}

export default function Deck() {
  return (
    <CardTarget className={styles.Deck} areaPath={deckPath}>
      <DrawDeck />
    </CardTarget>
  );
}
