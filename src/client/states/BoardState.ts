import { GameDefinition, GameEvent, Variant } from "../../game";
import { Immutable } from "../../util/HelperTypes";
import { TurnState, initTurnState, reduceTurnEvent } from "./TurnState";

//This class sh
export class BoardState {
  //Info to define game, should NEVER change after creation
  readonly variant: Immutable<Variant>;
  readonly playerNames: ReadonlyArray<string>;

  //Turns and events
  readonly turns: TurnState[];
  readonly events: GameEvent[];

  //Hypothetical turns and events
  readonly hypotheticalTurns: TurnState[];
  readonly hypotheticalEvents: GameEvent[];

  //Turn state currently being viewed
  //If in a hypothetical, this will be the last turn
  //before the hypothetical started
  turnIndex: number;

  //Whether or not the turnIndex is synchronized with the latestTurn
  paused: boolean;

  //Whether or not we are viewing a hypothetical
  hypothetical: boolean;

  //Known shuffle order
  shuffleOrder: number[];

  //Player of current perspective, -1 to follow turnIndex, undefined for spectator
  //This only effects card visibility
  perspective: number | undefined;

  //Which players hand should be displayed on top, -1 to follow turnIndex
  //This only effects the order of hands
  viewOrder: number;

  constructor({ variant, playerNames }: GameDefinition) {
    this.variant = variant;
    this.playerNames = playerNames;
    this.turns = [initTurnState(variant)];
    this.turnIndex = 0;
    this.paused = false;
    this.shuffleOrder = [];
    this.events = [];
    this.perspective = undefined;
    this.viewOrder = 0;
    this.hypotheticalTurns = [];
    this.hypotheticalEvents = [];
    this.hypothetical = false;
  }

  get latestTurn() {
    return this.turns[this.turns.length - 1];
  }

  get viewTurn() {
    if (this.hypothetical && this.hypotheticalTurns.length > 0) {
      return this.hypotheticalTurns[this.hypotheticalTurns.length - 1];
    } else {
      return this.turns[this.turnIndex];
    }
  }

  get playerOfTurn() {
    return (this.viewTurn.turn - 1) % this.variant.numPlayers;
  }

  getCardIfRevealed(index: number) {
    const cardValue = this.shuffleOrder[index];
    if (
      cardValue !== undefined &&
      (this.perspective === undefined ||
        this.latestTurn.cardReveals[
          this.perspective === -1 ? this.playerOfTurn : this.perspective
        ].has(index))
    ) {
      return cardValue;
    } else {
      return undefined;
    }
  }

  getTurn(num: number) {
    if (this.hypothetical && num >= this.turnIndex) {
      return this.hypotheticalTurns[num - this.turnIndex];
    } else {
      return this.turns[num];
    }
  }

  getEvent(num: number) {
    if (this.hypothetical && num >= this.turnIndex) {
      return this.hypotheticalEvents[num - this.turnIndex];
    } else {
      return this.events[num];
    }
  }
}
export default BoardState;

//Quick helper for adding events to the turn history
export function appendEvent(state: BoardState, event: GameEvent) {
  //Push event into history
  state.events.push(event);
  state.turns.push(reduceTurnEvent(state.latestTurn, event, state.variant));
  //If the turnIndex is not paused (as in we are not in replay or hypothetical mode), have the turnIndex follow the latestTurn
  if (!state.paused) {
    state.turnIndex = state.latestTurn.turn;
  }
}
