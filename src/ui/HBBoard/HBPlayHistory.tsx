import chroma from "chroma-js";
import colors from "../BaseColors";
import { useContext } from "react";
import { ClueType } from "../../game/types/Clue";
import { GameClueEvent, GameDiscardEvent, GameEventType, GamePlayEvent, GamePlayResultType } from "../../game/GameTypes";
import { GameUIContext, useClientLatestState, useClientViewState } from "./ClientGameStateManager";
import HBCardIcon from "./HBCardIcon";

import "./HBPlayHistory.scss";


const NaturalNums = ["zero", "one", "two", "three", "four", "five"];

type CluePlayDescriberProps = { turn: number; event: GameClueEvent };
function CluePlayDescriber({ turn, event: { touched, clue, target } }: CluePlayDescriberProps) {
  const viewState = useClientViewState();
  const numPlayers = viewState.game.definition.variant.numPlayers;
  const player = (turn - 1) % numPlayers;
  const playernames = viewState.game.definition.playerNames;
  const giverName = playernames[player];
  const targetName = playernames[target];
  const numTouched = touched.length;
  const subject = clue.type === ClueType.Number ? `#${clue.value}`: clue.value;
  let subjectstyle:any = {};
  if (clue.type === ClueType.Color) {
    const color = colors(clue.value);
    const backgroundColor = chroma.mix(color,"#FFFFFF", 0.5, "lrgb").hex();
    subjectstyle = {
      color,
      height: "40px",
      fontSize: "30px",
      backgroundColor,
      borderRadius: "5px",
      borderStyle: "solid",
      display: "inline-block",
      mask: "url(#outline)"
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
  return <span>{`${giverName} tells ${targetName} about ${NaturalNums[numTouched]} `} <div style={subjectstyle}>{subject}</div>{`${numTouched!==1 ? "s" : ""}`}</span>;
}


type DiscardPlayDescriberProps = { turn: number; event: GameDiscardEvent };
function DiscardPlayDescriber({ turn, event }: DiscardPlayDescriberProps) {
  const viewState = useClientViewState();
  const latestState = useClientLatestState();
  const shuffleOrder = latestState.shuffleOrder;
  const numPlayers = viewState.game.definition.variant.numPlayers;
  const player = (turn - 1) % numPlayers;
  const playerName = viewState.game.definition.playerNames[player];
  const { card } = event;
  const cardProps = latestState.game.deck.getCard(shuffleOrder[card]);
  return (
    <span>
      {`${playerName} discarded `}
      <HBCardIcon height="40px" {...cardProps}/>
      {/* {` from slot ${event.handSlot + 1}`} */}
    </span>
  );
}

type PlayPlayDescriberProps = { turn: number; event: GamePlayEvent };
function PlayPlayDescriber({ turn, event }: PlayPlayDescriberProps) {
  const viewState = useClientViewState();
  const latestState = useClientLatestState();
  const shuffleOrder = latestState.shuffleOrder;
  const numPlayers = viewState.game.definition.variant.numPlayers;
  const player = (turn - 1) % numPlayers;
  const playerName = viewState.game.definition.playerNames[player];
  const { card } = event;
  const cardProps = latestState.game.deck.getCard(shuffleOrder[card]);
  if (event.result === GamePlayResultType.Success) {
    return (
      <span>
        {`${playerName} played `}
        <HBCardIcon height="40px" {...cardProps}/>
        {/* {` from slot ${event.handSlot + 1}`} */}
      </span>
    );
  } else {
    return (
      <span>
        {`${playerName} misplayed `}
        <HBCardIcon height="40px" {...cardProps}/>
        {/* {` from slot ${event.handSlot + 1}`} */}
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
    case GameEventType.Clue:
      return <CluePlayDescriber turn={message} event={event} />;
    default:
      return <span>Unknown Event</span>;
  }
}

export default function HBPlayHistory() {
  const viewState = useClientViewState();
  const numPlayers = viewState.game.definition.variant.numPlayers;
  const turnNumber = viewState.game.turn;
  const displayAmount = Math.min(numPlayers, turnNumber);
  return (
    <div className="HBPlayHistory">
      {[...Array(displayAmount).keys()].map((_, i) => turnNumber - displayAmount + i).map(
        i => < PlayDescriber key={i} message={i} />)}
    </div>
  );
}
