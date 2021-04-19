import chroma from "chroma-js";

import colors from "../../BaseColors";
import {
  ClueType,
  GameClueEvent,
  GameDiscardEvent,
  GameEventType,
  GamePlayEvent,
  GamePlayResultType,
} from "../../../game";
import { DrawCard } from "../../DrawCard";
import { useBoardReducer, useBoardState } from "../../BoardContext";
import classNames from "../../util/classNames";
import * as ArrayUtil from "../../../util/ArrayUtil";

import styles from "./PlayHistory.css";
import darkregion from "../DarkRegion.css";
import { UserActionType } from "../../../client/types/UserAction";

const NaturalNums = ["zero", "one", "two", "three", "four", "five"];

type LocalCardData = Readonly<{
  readonly rank: number;
  readonly suit: string;
}>;

function useCardPlayData(
  event: GamePlayEvent | GameDiscardEvent,
  turn: number
): [LocalCardData, string, number] {
  return useBoardState(
    (s) => {
      const shuffleOrder = s.shuffleOrder;
      const deck = s.definition.variant.deck;
      const numPlayers = s.definition.variant.numPlayers;
      const player = (turn - 1) % numPlayers;
      return [
        deck.getCard(shuffleOrder[event.card]),
        s.definition.playerNames[player],
        s.getTurn(turn).hands[player].indexOf(event.card),
      ];
    },
    [event.card, turn],
    ArrayUtil.shallowCompare
  );
}

type CluePlayDescriberProps = {
  turn: number;
  event: GameClueEvent;
  onClick: React.ComponentPropsWithoutRef<"span">["onClick"];
};
function CluePlayDescriber({
  turn,
  event: { touched, clue, target },
  onClick,
}: CluePlayDescriberProps) {
  const definition = useBoardState(({ definition }) => definition);
  const numPlayers = definition.variant.numPlayers;
  const player = (turn - 1) % numPlayers;
  const playernames = definition.playerNames;
  const giverName = playernames[player];
  const targetName = playernames[target];
  const numTouched = touched.length;
  const subject = clue.type === ClueType.Number ? `#${clue.value}` : clue.value;
  let style =
    clue.type === ClueType.Color
      ? {
          className: styles.ColorSubject,
          style: {
            color: colors(clue.value),
            backgroundColor: chroma
              .mix(colors(clue.value), "#FFFFFF", 0.5, "lrgb")
              .hex(),
          },
        }
      : clue.type === ClueType.Number
      ? { className: styles.NumberSubject }
      : undefined;

  return (
    <span onClick={onClick}>
      {`${giverName} tells ${targetName} about ${NaturalNums[numTouched]} `}{" "}
      <div {...style}>{subject}</div>
      {`${numTouched !== 1 ? "s" : ""}`}
    </span>
  );
}

type DiscardPlayDescriberProps = {
  turn: number;
  event: GameDiscardEvent;
  onClick: React.ComponentPropsWithoutRef<"span">["onClick"];
};
function DiscardPlayDescriber({
  turn,
  event,
  onClick,
}: DiscardPlayDescriberProps) {
  const [card, playerName, slotNumber] = useCardPlayData(event, turn);
  return (
    <span onClick={onClick}>
      {`${playerName} discarded `}
      <DrawCard card={card} icon />
      {` from slot ${slotNumber + 1}`}
    </span>
  );
}

type PlayPlayDescriberProps = {
  turn: number;
  event: GamePlayEvent;
  onClick: React.ComponentPropsWithoutRef<"span">["onClick"];
};
function PlayPlayDescriber({ turn, event, onClick }: PlayPlayDescriberProps) {
  const [card, playerName, slotNumber] = useCardPlayData(event, turn);
  if (event.result === GamePlayResultType.Success) {
    return (
      <span onClick={onClick}>
        {`${playerName} played `}
        <DrawCard card={card} icon />
        {` from slot ${slotNumber + 1}`}
      </span>
    );
  } else {
    return (
      <span onClick={onClick}>
        {`${playerName} misplayed `}
        <DrawCard card={card} icon />
        {` from slot ${slotNumber + 1}`}
      </span>
    );
  }
}

type PlayDescriberProps = {
  turn: number;
  onClick: React.ComponentPropsWithoutRef<"span">["onClick"];
};
function PlayDescriber({ turn, onClick }: PlayDescriberProps) {
  const event = useBoardState((state) => state.getEvent(turn));
  switch (event.type) {
    case GameEventType.Deal: {
      return <span onClick={onClick}>Game Started</span>;
    }
    case GameEventType.Play:
      return <PlayPlayDescriber turn={turn} event={event} onClick={onClick} />;
    case GameEventType.Discard:
      return (
        <DiscardPlayDescriber turn={turn} event={event} onClick={onClick} />
      );
    case GameEventType.Clue:
      return <CluePlayDescriber turn={turn} event={event} onClick={onClick} />;
    default:
      return <span>Unknown Event</span>;
  }
}

export default function PlayHistory() {
  const [turnNumber, numPlayers] = useBoardState((s) => [
    s.viewTurn.turn,
    s.definition.variant.numPlayers,
  ]);
  const boardDispatch = useBoardReducer();
  const displayAmount = Math.min(numPlayers * 2, turnNumber);
  const thisIsNotBroken = false;
  const describers = thisIsNotBroken
    ? [...Array(displayAmount).keys()]
        .map((_, i) => turnNumber - displayAmount + i)
        .map((i) => (
          <PlayDescriber
            key={i}
            turn={i}
            onClick={() =>
              boardDispatch({ type: UserActionType.SetViewTurn, turn: i + 1 })
            }
          />
        ))
    : undefined;
  return (
    <div className={classNames(styles.PlayHistory, darkregion.DarkRegion)}>
      {describers}
      TODO: FIX ME REEEEEEE
    </div>
  );
}
