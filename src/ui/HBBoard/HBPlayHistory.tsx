import { useContext, useEffect, useState } from "react";
import { GameDiscardEvent, GameEventMessage, GameEventType, GamePlayEvent, GamePlayResultType } from "../../game/GameTypes";
import { GameUIContext } from "../ReactFrontendInterface";
import HBCardIcon from "./HBCardIcon";

import "./HBPlayHistory.scss";

type DiscardPlayDescriberProps = { turn: number; event: GameDiscardEvent };
function DiscardPlayDescriber({ turn, event }: DiscardPlayDescriberProps) {
  const context = useContext(GameUIContext);
  const numPlayers = context.getNumberOfPlayers();
  const player = (turn - 1) % numPlayers;
  const playerName = context.getPlayerNames()[player];
  const card = context.getCardInHand(player, event.handSlot, turn - 1);
  const cardProps = context.getCardDisplayableProps(card);
  return (
    <span>
      {`${playerName} discarded `}
      <HBCardIcon height="40px" {...cardProps}/>
      {` from slot ${event.handSlot + 1}`}
    </span>
  );
}

type PlayPlayDescriberProps = { turn: number; event: GamePlayEvent };
function PlayPlayDescriber({ turn, event }: PlayPlayDescriberProps) {
  const context = useContext(GameUIContext);
  const numPlayers = context.getNumberOfPlayers();
  const player = (turn - 1) % numPlayers;
  const playerName = context.getPlayerNames()[player];
  const card = context.getCardInHand(player, event.handSlot, turn - 1);
  const cardProps = context.getCardDisplayableProps(card);
  if (event.result === GamePlayResultType.Success) {
    return (
      <span>
        {`${playerName} played `}
        <HBCardIcon height="40px" {...cardProps}/>
        {` from slot ${event.handSlot + 1}`}
      </span>
    );
  } else {
    return (
      <span>
        {`${playerName} misplayed `}
        <HBCardIcon height="40px" {...cardProps}/>
        {` from slot ${event.handSlot + 1}`}
      </span>
    );
  }
}

type PlayDescriberProps = { message: number };
function PlayDescriber({ message }: PlayDescriberProps) {
  const context = useContext(GameUIContext);
  const { event } = context.getMessage(message);
  switch (event.type) {
    case GameEventType.Deal:
      return <span>Game Started</span>;
    case GameEventType.Play:
      return <PlayPlayDescriber turn={message} event={event} />;
    case GameEventType.Discard:
      return <DiscardPlayDescriber turn={message} event={event} />;
    default:
      return <span>Unknown Event</span>;
  }
}

export default function HBPlayHistory() {
  const context = useContext(GameUIContext);
  const numPlayers = context.getNumberOfPlayers();
  const [turnNumber, setTurnNumber] = useState(context.getCurrentTurn());
  const displayAmount = Math.min(numPlayers, turnNumber);
  useEffect(() => {
    const callback = () => {
      setTurnNumber(context.getCurrentTurn());
    };
    const removeFunc = () => { context.off("game-update", callback) };
    context.on("game-update", callback);
    return removeFunc;
  }, [context]);
  return (
    <div className="HBPlayHistory">
      {[...Array(displayAmount).keys()].map((_, i) => turnNumber - displayAmount + i).map(
        i => < PlayDescriber key={i} message={i} />)}
    </div>
  );
}
