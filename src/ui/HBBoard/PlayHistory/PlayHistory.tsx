import chroma from "chroma-js";

import colors from "../../BaseColors";
import { ClueType } from "../../../game/types/Clue";
import {
  GameClueEvent,
  GameDiscardEvent,
  GameEventType,
  GamePlayEvent,
  GamePlayResultType,
} from "../../../game/types/GameEvent";
import Card from "../../DrawCard";
import { useBoardState } from "../../BoardContext";
import classNames from "../../util/classNames";

import styles from "./PlayHistory.module.css";
import darkregion from "../DarkRegion.module.css";
import ArrayUtil from "../../../util/ArrayUtil";

const NaturalNums = ["zero", "one", "two", "three", "four", "five"];

type CluePlayDescriberProps = { turn: number; event: GameClueEvent };
function CluePlayDescriber({
  turn,
  event: { touched, clue, target },
}: CluePlayDescriberProps) {
  const definition = useBoardState(({ definition }) => definition);
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
  const [card, playerName, slotNumber] = useBoardState(
    (s) => {
      const shuffleOrder = s.shuffleOrder;
      const deck = s.definition.variant.deck;
      const numPlayers = s.definition.variant.numPlayers;
      const player = (turn - 1) % numPlayers;
      return [
        deck.getCard(shuffleOrder[event.card]),
        s.definition.playerNames[player],
        s.turnHistory[turn].hands[player].indexOf(event.card),
      ];
    },
    [event.card, turn],
    ArrayUtil.shallowCompare
  );
  return (
    <span>
      {`${playerName} discarded `}
      <Card card={card} icon />
      {` from slot ${slotNumber + 1}`}
    </span>
  );
}

type PlayPlayDescriberProps = { turn: number; event: GamePlayEvent };
function PlayPlayDescriber({ turn, event }: PlayPlayDescriberProps) {
  const [card, playerName, slotNumber] = useBoardState(
    (s) => {
      const shuffleOrder = s.shuffleOrder;
      const deck = s.definition.variant.deck;
      const numPlayers = s.definition.variant.numPlayers;
      const player = (turn - 1) % numPlayers;
      return [
        deck.getCard(shuffleOrder[event.card]),
        s.definition.playerNames[player],
        s.turnHistory[turn].hands[player].indexOf(event.card),
      ];
    },
    [event.card, turn],
    ArrayUtil.shallowCompare
  );
  if (event.result === GamePlayResultType.Success) {
    return (
      <span>
        {`${playerName} played `}
        <Card card={card} icon />
        {` from slot ${slotNumber + 1}`}
      </span>
    );
  } else {
    return (
      <span>
        {`${playerName} misplayed `}
        <Card card={card} icon />
        {` from slot ${slotNumber + 1}`}
      </span>
    );
  }
}

type PlayDescriberProps = { turn: number };
function PlayDescriber({ turn }: PlayDescriberProps) {
  const event = useBoardState(({ events }) => events[turn]);
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

export default function PlayHistory() {
  const [turnNumber, numPlayers] = useBoardState((s) => [
    s.viewTurn.turn,
    s.definition.variant.numPlayers,
  ]);
  const displayAmount = Math.min(numPlayers * 2, turnNumber);
  return (
    <div className={classNames(styles.PlayHistory, darkregion.DarkRegion)}>
      {[...Array(displayAmount).keys()]
        .map((_, i) => turnNumber - displayAmount + i)
        .map((i) => (
          <PlayDescriber key={i} turn={i} />
        ))}
    </div>
  );
}
