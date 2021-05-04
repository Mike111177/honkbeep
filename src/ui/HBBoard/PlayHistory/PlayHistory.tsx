import { mix } from "chroma-js";

import colors from "../../BaseColors";
import {
  ClueType,
  GameClueEvent,
  GameDiscardEvent,
  GameEventType,
  GamePlayEvent,
  GamePlayResultType,
} from "../../../game";
import { useBoardReducer, useBoardStateSelector } from "../../BoardContext";
import classNames from "../../util/classNames";
import * as ArrayUtil from "../../../util/ArrayUtil";

import styles from "./PlayHistory.css";
import darkregion from "../DarkRegion.css";
import { UserActionType } from "../../../client/types/UserAction";
import { ErrorBoundary } from "../../util/ErrorBoundry";

const NaturalNums = ["zero", "one", "two", "three", "four", "five"];

type LocalCardData = Readonly<{
  readonly rank: number;
  readonly suit: string;
}>;

function useCardPlayData(
  event: GamePlayEvent | GameDiscardEvent,
  turn: number
): [LocalCardData, string, number] {
  return useBoardStateSelector(
    (s) => {
      const shuffleOrder = s.shuffleOrder;
      const deck = s.variant.deck;
      const numPlayers = s.variant.numPlayers;
      const player = (turn - 1) % numPlayers;
      return [
        deck.getCard(shuffleOrder[event.card]),
        s.playerNames[player],
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
  const [variant, playerNames] = useBoardStateSelector(
    ({ variant, playerNames }) => [variant, playerNames],
    [],
    ArrayUtil.shallowCompare
  );
  const numPlayers = variant.numPlayers;
  const player = (turn - 1) % numPlayers;
  const giverName = playerNames[player];
  const targetName = playerNames[target];
  const numTouched = touched.length;
  const subject = clue.type === ClueType.Rank ? `${clue.value}` : clue.value;
  let style =
    clue.type === ClueType.Color
      ? {
          className: styles.ColorSubject,
          style: {
            color: colors(clue.value),
            backgroundColor: mix(
              colors(clue.value),
              "#FFFFFF",
              0.5,
              "lrgb"
            ).hex(),
          },
        }
      : clue.type === ClueType.Rank
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
  const props = {
    className: styles.ColorSubject,
    style: {
      color: colors(card.suit),
      backgroundColor: mix(colors(card.suit), "#FFFFFF", 0.5, "lrgb").hex(),
    },
  };

  return (
    <span onClick={onClick}>
      {`${playerName} discarded `}
      <div {...props}>{card.rank}</div>
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
  const props = {
    className: styles.ColorSubject,
    style: {
      color: colors(card.suit),
      backgroundColor: mix(colors(card.suit), "#FFFFFF", 0.5, "lrgb").hex(),
    },
  };

  const playedVerb =
    event.result === GamePlayResultType.Success
      ? "successfully played"
      : "failed to play";
  return (
    <span onClick={onClick}>
      {`${playerName} ${playedVerb} `}
      <div {...props}>{card.rank}</div>
      {` from slot ${slotNumber + 1}`}
    </span>
  );
}

type PlayDescriberProps = {
  turn: number;
  onClick: React.ComponentPropsWithoutRef<"span">["onClick"];
};
function PlayDescriber({ turn, onClick }: PlayDescriberProps) {
  const event = useBoardStateSelector((state) => state.getEvent(turn));
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
  const [turnNumber, numPlayers] = useBoardStateSelector((s) => [
    s.viewTurn.turn,
    s.variant.numPlayers,
  ]);
  const boardDispatch = useBoardReducer();
  const displayAmount = Math.min(numPlayers * 2, turnNumber);
  return (
    <div className={classNames(styles.PlayHistory, darkregion.DarkRegion)}>
      <ErrorBoundary>
        {[...Array(displayAmount).keys()]
          .map((_, i) => turnNumber - displayAmount + i)
          .map((i) => (
            <PlayDescriber
              key={i}
              turn={i}
              onClick={() =>
                boardDispatch({ type: UserActionType.SetViewTurn, turn: i + 1 })
              }
            />
          ))}
      </ErrorBoundary>
    </div>
  );
}
