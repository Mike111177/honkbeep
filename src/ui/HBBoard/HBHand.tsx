import { useContext } from "react";
import { CardTarget } from "./CardFloat";
import { GameUIContext } from "./ClientState";

import "./HBHand.scss";

type CardInHandProps = {
  slot: number;
  player: number;
};

function CardInHand({ player, slot }: CardInHandProps) {
  return <CardTarget areaPath={["hands", player, slot]} />;
}

type HBHandProps = {
  player: number;
};

export function HBHand({ player }: HBHandProps) {
  const context = useContext(GameUIContext);
  const [playerNames, cards, myTurn] = context.useBoardState((boardState) => {
    return [
      boardState.initialTurn.game.definition.playerNames,
      boardState.viewTurn.game.hands[player],
      player ===
        (boardState.viewTurn.game.turn - 1) %
          boardState.viewTurn.game.definition.variant.numPlayers,
    ];
  });
  return (
    <div className={`HBHand${myTurn ? " OnPlayerTurn" : ""}`}>
      <div className="handCardArea">
        {cards.map((n, i) => (
          <CardInHand player={player} slot={i} key={i} />
        ))}
      </div>
      <span className="handname">{playerNames[player]}</span>
    </div>
  );
}

type HBHandsAreaProps = {
  perspective: number;
};
export function HBHandsArea({ perspective }: HBHandsAreaProps) {
  const context = useContext(GameUIContext);
  const playerNames =
    context.boardState.initialTurn.game.definition.playerNames;
  const numPlayers =
    context.boardState.initialTurn.game.definition.variant.numPlayers;
  return (
    <div className="HBHandsArea">
      {playerNames.map((n, i) => (
        <HBHand player={(i + perspective) % numPlayers} key={i} />
      ))}
    </div>
  );
}
