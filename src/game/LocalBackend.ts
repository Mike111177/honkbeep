import EventEmitter from "events";
import BackendInterface from "./BackendInterface";
import {
  GameState,
  GameEvent} from "./GameTypes";
import LocalServer from "./LocalServer";



//Meant for dictating logic of local games or template games
export default class LocalBackend extends EventEmitter implements BackendInterface {
  private state?: GameState;
  private server: LocalServer;
  private ready: boolean = false;
  private player: number;

  constructor(player: number, server: LocalServer) {
    super();
    this.player = player;
    server.requestInitialState(this.player).then(state => {
      this.state = state;
      this.ready = true;
      this.emit("ready");
    });
    this.server = server;
  }

  isReady(): boolean {
    return this.ready;
  }

  onReady(callback: () => void) {
    if (this.isReady()) {
      callback();
    } else {
      this.once("ready", callback);
    }
  }

  currentState(): GameState {
    return this.state!;
  }

  async attemptPlayerAction(action: GameEvent) {
    const actionSuccess = await this.server.attemptPlayerAction(action);
    if (actionSuccess) {
      this.emit("gameStateChanged");
    }
    return actionSuccess;
  }
}
