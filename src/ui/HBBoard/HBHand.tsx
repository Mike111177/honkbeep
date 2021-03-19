import { CardTarget } from "./CardFloat";
import { useClientLatestState, useClientViewState } from './ClientGameStateManager';

import "./HBHand.scss";

type CardInHandProps = {
  slot: number;
  player: number;
}

function CardInHand({ player, slot }: CardInHandProps) {
  return (
    <CardTarget areaPath={["hands", player, slot]}/>
  );
}

type HBHandProps = {
  player: number;
}

export function HBHand({ player }: HBHandProps) {
  const viewState = useClientViewState();
  const playerNames = viewState.game.definition.playerNames;
  const cards = viewState.game.hands[player];
  const myTurn = player === (viewState.game.turn - 1) % viewState.game.definition.variant.numPlayers;

  return (
    <div className={`HBHand${myTurn? " OnPlayerTurn" : ""}`}>
      <div className="handCardArea">
        {cards.map((n, i) => <CardInHand player={player} slot={i} key={i} />)}
      </div>
      <span className="handname">
        {playerNames[player]}
      </span>
    </div>
  );

}

type HBHandsAreaProps = {
  perspective: number;
}
export function HBHandsArea({ perspective }: HBHandsAreaProps) {
  const latestState = useClientLatestState();
  const playerNames = latestState.game.definition.playerNames;
  const numPlayers = latestState.game.definition.variant.numPlayers;
  return (
    <div className="HBHandsArea">
      {playerNames.map((n, i) => <HBHand player={(i + perspective) % (numPlayers)} key={i} />)}
    </div>
  );
}
