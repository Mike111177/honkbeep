import Backend from "./types/Backend";
import { GameAttempt } from "../game/types/GameEvent";
import LocalServer from "./LocalServer";
import { GameData, GameEventMessage } from "./types/GameData";

//Meant for dictating logic of local games or template games
export default class LocalBackend implements Backend {
  readonly player: number;
  private server: LocalServer;
  private state?: GameData;
  private connected = false;
  private listener?: () => void;

  constructor(player: number, server: LocalServer) {
    this.player = player;
    this.server = server;
  }

  async connect() {
    if (!this.connected) {
      //Connect to "Server"
      await this.server.connect(this.player, this.onEvent.bind(this));

      //"Download" game events up to this point
      this.state = await this.server.requestInitialState(this.player);

      this.connected = true;
    }
  }

  currentState(): GameData {
    return this.state!;
  }

  onEvent(e: GameEventMessage) {
    this.state!.events[e.event.turn] = e;
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
}
