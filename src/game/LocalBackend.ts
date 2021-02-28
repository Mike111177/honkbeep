import EventEmitter from "events";
import BackendInterface from "./BackendInterface";
import {
  GameState,
  GameAttempt,
  GameEventMessage
} from "./GameTypes";
import LocalServer from "./LocalServer";



//Meant for dictating logic of local games or template games
export default class LocalBackend extends EventEmitter implements BackendInterface {
  private player: number;
  private server: LocalServer;
  private state?: GameState;

  constructor(player: number, server: LocalServer) {
    super();
    this.player = player;
    this.server = server;
    this.initConnection(); 
  }

  private async initConnection() {
    //Connect to "Server"
    await this.server.connect(this.player, this.onEvent.bind(this));
    
    //"Download" game events up to this point
    this.state = await this.server.requestInitialState(this.player);
  
    this.emit("ready");
  }

  isReady(): boolean {
    return this.state !== undefined;
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

  onEvent(e: GameEventMessage) {
    this.state!.events[e.event.turn] = e;
    this.emit("gameStateChanged");
  }

  async attemptPlayerAction(action: GameAttempt) {
    const actionSuccess = await this.server.attemptPlayerAction(this.player, action);
    return actionSuccess;
  }
}
