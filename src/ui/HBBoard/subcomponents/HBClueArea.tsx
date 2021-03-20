import React, { useContext, useState } from "react";

import { GameEventType } from "../../../game/GameTypes";
import { Clue, colorClue, numberClue } from "../../../game/types/Clue";
import colors from "../../BaseColors";
import ArrayUtil from "../../../util/ArrayUtil";
import { BoardContext, useBoardState } from "../types/BoardContext";

import "./HBClueArea.scss";

export default function HBClueArea() {
  //Get state
  const context = useContext(BoardContext);
  const [players, turn, suits, clues] = useBoardState((boardState) => {
    return [
      boardState.viewTurn.game.definition.playerNames,
      boardState.viewTurn.game.turn,
      boardState.viewTurn.game.definition.variant.suits,
      boardState.viewTurn.game.clues,
    ];
  });

  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);

  //Make playerButtons
  const playerButtons = players
    .map((p, i) => (
      <div
        key={i}
        className={`PlayerClueButton${
          selectedPlayer === i ? " SelectedPlayerButton" : ""
        }`}
        onClick={() => setSelectedPlayer(i)}
      >
        {p}
      </div>
    ))
    .filter((i, n) => n !== (turn - 1) % players.length);

  //Make Color Clue Buttons
  const [colorClues] = useState(() => suits.map(colorClue));
  const colorClueButtons = colorClues.map((clue, n) => (
    <svg
      key={n}
      className="ClueButton"
      viewBox="0 0 100 100"
      onClick={() => setSelectedClue(clue)}
    >
      <rect
        x="10%"
        y="10%"
        width="80%"
        height="80%"
        rx="10%"
        fill={clue === selectedClue ? "#FFFFFF" : colors(clue.value)}
        stroke="#000000"
        strokeWidth={clue === selectedClue ? 0 : "10%"}
      />
      {clue === selectedClue ? (
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
  ));

  //Make Number Clue Buttons
  const [numberClues] = useState(() => ArrayUtil.iota(5, 1).map(numberClue));
  const numberClueButtons = numberClues.map((clue, n) => (
    <svg
      key={n}
      className="ClueButton"
      viewBox="0 0 100 100"
      onClick={() => setSelectedClue(clue)}
    >
      <rect
        x="10%"
        y="10%"
        width="80%"
        height="80%"
        rx="10%"
        fill={clue === selectedClue ? "#FFFFFF" : "#000000"}
        stroke="#000000"
        strokeWidth={clue === selectedClue ? 0 : "10%"}
      />
      <text
        fill={clue === selectedClue ? "#000000" : "#FFFFFF"}
        fontSize="80"
        x="50%"
        y="45%"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {clue.value}
      </text>
    </svg>
  ));

  //Submit Button listener
  const submit = async () => {
    if (selectedClue !== null && selectedPlayer !== null) {
      if (
        await context.attemptPlayerAction({
          type: GameEventType.Clue,
          target: selectedPlayer,
          clue: selectedClue,
        })
      ) {
        setSelectedClue(null);
        setSelectedPlayer(null);
      }
    }
  };

  if (clues !== 0) {
    return (
      <div
        className="HBClueArea"
        style={{ gridTemplateColumns: `auto auto auto` }}
      >
        <div
          className="HBClueButtonAreaPlayer"
          style={{ gridTemplateRows: `repeat(${players.length - 1}, 1fr)` }}
        >
          {playerButtons}
        </div>
        <div className="ClueSelector">
          <div
            className="HBClueButtonAreaSuit"
            style={{ gridTemplateColumns: `repeat(${suits.length}, auto)` }}
          >
            {colorClueButtons}
          </div>
          <div className="HBClueButtonAreaNumber">{numberClueButtons}</div>
        </div>
        <div className="submitButton" onClick={submit}>
          ✓
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
