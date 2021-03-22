import chroma from "chroma-js";

import colors from "../../BaseColors";
import { ClueType } from "../../../game/types/Clue";
import {
  GameClueEvent,
  GameDiscardEvent,
  GameEventType,
  GamePlayEvent,
  GamePlayResultType,
} from "../../../game/GameTypes";
import Card from "../../Card";
import { useBoardState } from "../../BoardContext";

import "./HBPlayHistory.scss";

const NaturalNums = ["zero", "one", "two", "three", "four", "five"];

type CluePlayDescriberProps = { turn: number; event: GameClueEvent };
function CluePlayDescriber({
  turn,
  event: { touched, clue, target },
}: CluePlayDescriberProps) {
  const definition = useBoardState().definition;
  const numPlayers = definition.variant.numPlayers;
  const player = (turn - 1) % numPlayers;
  const playernames = definition.playerNames;
  const giverName = playernames[player];
  const targetName = playernames[target];
  const numTouched = touched.length;
  const subject = clue.type === ClueType.Number ? `#${clue.value}` : clue.value;
  let subjectstyle: any = {};
  if (clue.type === ClueType.Color) {
    const color = colors(clue.value);
    const backgroundColor = chroma.mix(color, "#FFFFFF", 0.5, "lrgb").hex();
    subjectstyle = {
      color,
      height: "40px",
      fontSize: "30px",
      backgroundColor,
      borderRadius: "5px",
      borderStyle: "solid",
      display: "inline-block",
      mask: "url(#outline)",
    };
  } else if (clue.type === ClueType.Number) {
    subjectstyle = {
      height: "40px",
      fontSize: "30px",
      borderRadius: "5px",
      borderStyle: "solid",
      display: "inline-block",
    };
  }
  return (
    <span>
      {`${giverName} tells ${targetName} about ${NaturalNums[numTouched]} `}{" "}
      <div style={subjectstyle}>{subject}</div>
      {`${numTouched !== 1 ? "s" : ""}`}
    </span>
  );
}

type DiscardPlayDescriberProps = { turn: number; event: GameDiscardEvent };
function DiscardPlayDescriber({ turn, event }: DiscardPlayDescriberProps) {
  const [shuffleOrder, numPlayers, playerNames, deck] = useBoardState(
    (boardState) => {
      return [
        boardState.shuffleOrder,
        boardState.definition.variant.numPlayers,
        boardState.definition.playerNames,
        boardState.deck,
      ];
    }
  );
  const player = (turn - 1) % numPlayers;
  const playerName = playerNames[player];
  const { card } = event;
  const cardData = deck.getCard(shuffleOrder[card]);
  return (
    <span>
      {`${playerName} discarded `}
      <Card card={cardData} icon />
      {/* {` from slot ${event.handSlot + 1}`} */}
    </span>
  );
}

type PlayPlayDescriberProps = { turn: number; event: GamePlayEvent };
function PlayPlayDescriber({ turn, event }: PlayPlayDescriberProps) {
  const [shuffleOrder, numPlayers, playerNames, deck] = useBoardState(
    (boardState) => {
      return [
        boardState.shuffleOrder,
        boardState.definition.variant.numPlayers,
        boardState.definition.playerNames,
        boardState.deck,
      ];
    }
  );
  const player = (turn - 1) % numPlayers;
  const playerName = playerNames[player];
  const { card } = event;
  const cardData = deck.getCard(shuffleOrder[card]);
  if (event.result === GamePlayResultType.Success) {
    return (
      <span>
        {`${playerName} played `}
        <Card card={cardData} icon />
        {/* {` from slot ${event.handSlot + 1}`} */}
      </span>
    );
  } else {
    return (
      <span>
        {`${playerName} misplayed `}
        <Card card={cardData} icon />
        {/* {` from slot ${event.handSlot + 1}`} */}
      </span>
    );
  }
}

type PlayDescriberProps = { turn: number };
function PlayDescriber({ turn }: PlayDescriberProps) {
  const [event] = useBoardState((boardState) => {
    return [boardState.events[turn]];
  });
  switch (event.type) {
    case GameEventType.Deal:
      return <span>Game Started</span>;
    case GameEventType.Play:
      return <PlayPlayDescriber turn={turn} event={event} />;
    case GameEventType.Discard:
      return <DiscardPlayDescriber turn={turn} event={event} />;
    case GameEventType.Clue:
      return <CluePlayDescriber turn={turn} event={event} />;
    default:
      return <span>Unknown Event</span>;
  }
}

export default function HBPlayHistory() {
  const [turnNumber, numPlayers] = useBoardState((boardState) => {
    return [boardState.viewTurn.turn, boardState.definition.variant.numPlayers];
  });
  const displayAmount = Math.min(numPlayers, turnNumber);
  return (
    <div className="HBPlayHistory">
      {[...Array(displayAmount).keys()]
        .map((_, i) => turnNumber - displayAmount + i)
        .map((i) => (
          <PlayDescriber key={i} turn={i} />
        ))}
    </div>
  );
}
