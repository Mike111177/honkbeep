import React, { useContext, useState } from "react";

import { GameUIContext } from '../ReactFrontendInterface';
import { Clue, ClueType, GameEventType } from "../../game/GameTypes";
import colors from "../BaseColors";

import "./HBClueArea.scss";

type HBClueButtonProps = {
  clue: Clue;
  selected: boolean;
  setSelectedClue: React.Dispatch<React.SetStateAction<Clue | null>>;
};
function HBClueButton({ clue, selected, setSelectedClue }: HBClueButtonProps) {
  if (clue.type === ClueType.Color) {
    const color = colors(clue.color);
    return (
      <svg className="ClueButton" viewBox="0 0 100 100" onClick={() => setSelectedClue(clue)}>
        <rect x="10%" y="10%" width="80%" height="80%" rx="10%" fill={selected ? "#FFFFFF" : color} stroke="#000000" strokeWidth={selected ? 0 : "10%"} />
        {selected ? <rect x="17.5%" y="17.5%" width="65%" height="65%" rx="10%" fill={color} stroke="#000000" strokeWidth="2.5%" /> : undefined}
      </svg>
    );
  } else if (clue.type === ClueType.Number) {
    return (
      <svg className="ClueButton" viewBox="0 0 100 100" onClick={() => setSelectedClue(clue)}>
        <rect x="10%" y="10%" width="80%" height="80%" rx="10%" fill={selected ? "#FFFFFF" : "#000000"} stroke="#000000" strokeWidth={selected ? 0 : "10%"} />
        <text fill={selected ? "#000000" : "#FFFFFF"} fontSize="80" x="50%" y="45%" textAnchor='middle' dominantBaseline='central'>{clue.number}</text>
      </svg>
    );
  } else {
    return <></>;
  }
}

export default function HBClueArea() {
  const context = useContext(GameUIContext);
  const suits = context.getSuits();
  const players = context.getPlayerNames();
  const turn = context.getCurrentTurn();

  const [{ colorClues, numberClues }] = useState(() => ({
    colorClues: suits.map<Clue>(c => ({ type: ClueType.Color, color: c })),
    numberClues: [1, 2, 3, 4, 5].map<Clue>(n => ({ type: ClueType.Number, number: n }))
  }));
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);



  const [selectedClue, setSelectedClue] = useState<Clue | null>(null);

  return (
    <div className="HBClueArea" style={{ gridTemplateColumns: `auto auto auto` }}>
      <div className="HBClueButtonAreaPlayer" style={{ gridTemplateRows: `repeat(${players.length - 1}, 1fr)` }}>
        {
          players.map((p, i) =>
            <div key={i} className={`PlayerClueButton${selectedPlayer === i ? " SelectedPlayerButton" : ""}`} onClick={() => setSelectedPlayer(i)}>{p}</div>
          ).filter((i, n) => n !== (turn - 1) % players.length)
        }
      </div>
      <div className="ClueSelecter">
        <div className="HBClueButtonAreaSuit" style={{ gridTemplateColumns: `repeat(${suits.length}, auto)` }}>
          {colorClues.map((i, n) => <HBClueButton key={n} clue={i} selected={i === selectedClue} setSelectedClue={setSelectedClue} />)}
        </div>
        <div className="HBClueButtonAreaNumber">
          {numberClues.map((i, n) => <HBClueButton key={n} clue={i} selected={i === selectedClue} setSelectedClue={setSelectedClue} />)}
        </div>
      </div>
      <div className="submitButton" onClick={
        async () => {
          if (selectedClue !== null && selectedPlayer !== null) {
            if (await context.attemptPlayerAction({
              type: GameEventType.Clue,
              target: selectedPlayer,
              clue: selectedClue
            })) {
              setSelectedClue(null);
              setSelectedPlayer(null);
            }
          }
        }
      }>✓</div>
    </div>
  );
}
