import Backend from "honkbeep-protocol/types/Backend";
import { GameAttempt } from "honkbeep-game";
import ServerBoard from "honkbeep-protocol/ServerBoard";
import { GameData, GameEventMessage } from "honkbeep-protocol/types/GameData";

//Meant for dictating logic of local games or template games
export default class LocalBackend implements Backend {
  readonly player: number;
  private data?: GameData;
  private server: ServerBoard;
  private listener?: () => void;
  private connected = false;

  constructor(player: number, server: ServerBoard) {
    this.player = player;
    this.server = server;
  }

  async connect() {
    if (!this.connected) {
      //Connect to "Server"
      await this.server.connect({
        player: this.player,
        callback: this.onEvent.bind(this),
      });

      //"Download" game events up to this point
      this.data = await this.server.requestInitialState(this.player);

      this.connected = true;
    }
  }

  currentData(): GameData {
    return this.data!;
  }

  onEvent(e: GameEventMessage) {
    this.data!.events[e.event.turn] = e;
    if (this.listener !== undefined) {
      this.listener();
    }
  }

  async attemptPlayerAction(action: GameAttempt) {
    const actionSuccess = await this.server.attemptPlayerAction(
      this.player,
      action
    );
    return actionSuccess;
  }

  onChange(callback: () => void): void {
    this.listener = callback;
  }

  get viewOrder() {
    return this.player;
  }

  //Nothing needs to be done to close this
  close() {}
}
