import React, { useCallback, useState } from "react";

import { GameEventType } from "../../../game/types/GameEvent";
import {
  Clue,
  ColorClue,
  colorClue,
  RankClue,
  rankClue,
} from "../../../game/types/Clue";
import colors from "../../BaseColors";
import * as ArrayUtil from "../../../util/ArrayUtil";
import { useBoardReducer, useBoardState } from "../../BoardContext";
import { UserActionType } from "../../../client/types/UserAction";

import styles from "./ClueArea.css";
import { ErrorBoundary } from "../../util/ErrorBoundry";

type Player = { p: string; i: number };
type ClueButtonProps<T extends Clue | Player, S = T> = {
  val: T;
  selected: boolean;
  set: (s: S) => any;
};

type ColorButtonProps = ClueButtonProps<ColorClue>;
function ColorClueButton({ val: clue, selected, set }: ColorButtonProps) {
  return (
    <svg
      className={styles.ClueButton}
      viewBox="0 0 100 100"
      onClick={() => set(clue)}
    >
      <rect
        x="10%"
        y="10%"
        width="80%"
        height="80%"
        rx="10%"
        fill={selected ? "white" : colors(clue.value)}
        stroke="black"
        strokeWidth={selected ? 0 : "10%"}
      />
      {selected ? (
        <rect
          x="17.5%"
          y="17.5%"
          width="65%"
          height="65%"
          rx="10%"
          fill={colors(clue.value)}
          stroke="#000000"
          strokeWidth="2.5%"
        />
      ) : undefined}
    </svg>
  );
}

type NumberButtonProps = ClueButtonProps<RankClue>;
function NumberClueButton({ val: clue, selected, set }: NumberButtonProps) {
  return (
    <svg
      className={styles.ClueButton}
      viewBox="0 0 100 100"
      onClick={() => set(clue)}
    >
      <rect
        x="10%"
        y="10%"
        width="80%"
        height="80%"
        rx="10%"
        fill={selected ? "white" : "black"}
        stroke="black"
        strokeWidth={selected ? 0 : "10%"}
      />
      <text
        fill={selected ? "black" : "white"}
        fontSize="80"
        x="50%"
        y="45%"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {clue.value}
      </text>
    </svg>
  );
}

type PlayerButtonProps = ClueButtonProps<Player, number>;
function PlayerButton({ val: { p, i }, selected, set }: PlayerButtonProps) {
  return (
    <div
      className={selected ? styles.SelectedPlayerButton : styles.PlayerButton}
      onClick={() => set(i)}
    >
      {p}
    </div>
  );
}

export default function HBClueArea() {
  //Get state
  const boardDispatch = useBoardReducer();
  const [players, turn, suits, clues] = useBoardState(
    (s) => {
      return [
        s.playerNames,
        s.viewTurn.turn,
        s.variant.suits,
        s.viewTurn.clues,
      ];
    },
    [],
    ArrayUtil.shallowCompare
  );

  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);

  //Make playerButtons
  const playerButtons = players
    .map((p, i) => (
      <PlayerButton
        key={i}
        val={{ p, i }}
        selected={selectedPlayer === i}
        set={setSelectedPlayer}
      />
    ))
    .filter((i, n) => n !== (turn - 1) % players.length);

  //Make Color Clue Buttons
  const [colorClues] = useState(() => suits.map(colorClue));
  const colorClueButtons = colorClues.map((clue, n) => (
    <ColorClueButton
      val={clue}
      selected={selectedClue === clue}
      key={n}
      set={setSelectedClue}
    />
  ));

  //Make Number Clue Buttons
  const [numberClues] = useState(() => ArrayUtil.iota(5, 1).map(rankClue));
  const numberClueButtons = numberClues.map((clue, n) => (
    <NumberClueButton
      val={clue}
      selected={selectedClue === clue}
      key={n}
      set={setSelectedClue}
    />
  ));

  //Submit Button listener
  const submit = useCallback(async () => {
    if (selectedClue !== null && selectedPlayer !== null) {
      if (
        await boardDispatch({
          type: UserActionType.GameAttempt,
          attempt: {
            type: GameEventType.Clue,
            target: selectedPlayer,
            clue: selectedClue,
          },
        })
      ) {
        setSelectedClue(null);
        setSelectedPlayer(null);
      }
    }
  }, [boardDispatch, selectedClue, selectedPlayer]);

  if (clues !== 0) {
    return (
      <div className={styles.ClueArea}>
        <ErrorBoundary>
          <div className={styles.PlayerArea}>{playerButtons}</div>
          <div className={styles.ClueSelector}>
            <div className={styles.ClueButtonArea}>{colorClueButtons}</div>
            <div className={styles.ClueButtonArea}>{numberClueButtons}</div>
          </div>
          <div className={styles.SubmitButton} onClick={submit}>
            ✓
          </div>
        </ErrorBoundary>
      </div>
    );
  } else {
    return <></>;
  }
}
