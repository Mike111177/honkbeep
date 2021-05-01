import { GameAttempt } from "../game";
import Backend from "./types/Backend";
import { GameData } from "./types/GameData";
import { GameMessage, GameMessageType } from "./types/GameMessages";

export default class SocketBackend implements Backend {
  viewOrder: number;
  private state?: GameData;
  private ws?: WebSocket;
  private listener?: () => void;
  constructor() {
    this.viewOrder = 0;
  }
  connect(): Promise<void> {
    const ws = new WebSocket(`ws://${window.location.host}/socket`);
    const onMessage = this.onMessage.bind(this);
    const setState = (s: GameData) => (this.state = s);
    const prom = new Promise<void>((resolve, reject) => {
      ws.onopen = () => {
        //Only run this once
        ws.onopen = () => {};
        ws.onmessage = (event) => {
          //Lets now wait for the server ready message
          const data = JSON.parse(event.data) as GameMessage;
          if (data.type !== GameMessageType.GameServerReady) {
            reject(
              `Server sent data before it sent ready message! MsgType: ${data}`
            );
          }
          //Now lets ask the server for the current game data
          ws.onmessage = (event) => {
            const data = JSON.parse(event.data) as GameMessage;
            if (data.type === GameMessageType.GameDataResponse) {
              setState(data.data);
              ws.onmessage = onMessage;
              ws.send(
                JSON.stringify({ type: GameMessageType.GameClientReady })
              );
              resolve();
            } else {
              reject(
                `Server sent data before we were ready! MsgType: ${data.type}`
              );
            }
            //Next time we get a message lets handle it normally
          };
          ws.send(JSON.stringify({ type: GameMessageType.GameDataRequest }));
        };
      };
    });
    this.ws = ws;
    return prom;
  }
  onMessage() {}
  currentState(): GameData {
    return this.state!;
  }
  onChange(callback: () => void): void {
    this.listener = callback;
  }
  attemptPlayerAction(action: GameAttempt): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  close() {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = undefined;
  }
}
