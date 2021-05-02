import { unstable_batchedUpdates } from "react-dom";
import { GameAttempt } from "../game";
import { MessageSocket } from "../util/MessageSocket";
import Backend from "./types/Backend";
import { GameData } from "./types/GameData";
import { GameMessage, GameMessageType } from "./types/GameMessages";
import * as Api from "../client/Api";

export default class SocketBackend implements Backend {
  private player?: number;
  private data?: GameData;
  private ws?: MessageSocket<GameMessage>;
  private listener?: () => void;
  private pendingAttempt?: (result: boolean) => void;

  connect(): Promise<void> {
    const ws = Api.game();
    this.ws = ws;
    const onMessage = this.onMessage.bind(this);
    const setState = (s: GameData) => (this.data = s);
    return new Promise<GameMessage>((resolve) => {
      //Then lets wait for the first server ready message to come in
      ws.onmessage = (data) => resolve(data);
    })
      .then(
        (serverReadyMsg) =>
          //Now lets ask the server for the current game data
          new Promise<GameMessage>((resolve, reject) => {
            if (serverReadyMsg.type === GameMessageType.GameServerReady) {
              ws.onmessage = (data) => resolve(data);
              ws.send({ type: GameMessageType.GameDataRequest });
              this.player = serverReadyMsg.player;
            } else {
              reject(
                `Server sent data before it sent ready message! MsgType: ${serverReadyMsg}`
              );
            }
          })
      )
      .then(
        (gameDataMsg) =>
          //Now load game data
          new Promise<void>((resolve, reject) => {
            if (gameDataMsg.type === GameMessageType.GameDataResponse) {
              setState(gameDataMsg.data);
              //Transfer to our onMessage method
              ws.onmessage = onMessage;
              ws.send({ type: GameMessageType.GameClientReady });
              resolve();
            } else {
              reject(
                `Server sent data before we were ready! MsgType: ${gameDataMsg.type}`
              );
            }
          })
      );
  }

  onMessage(msg: GameMessage) {
    switch (msg.type) {
      case GameMessageType.GameEventNotification: {
        unstable_batchedUpdates(() => {
          const { event: e } = msg;
          this.data!.events[e.event.turn] = e;
          if (this.listener !== undefined) {
            this.listener();
          }
          if (this.pendingAttempt !== undefined) {
            this.pendingAttempt(true);
            this.pendingAttempt = undefined;
          }
        });
        break;
      }
      case GameMessageType.GameAttemptRejected: {
        if (this.pendingAttempt !== undefined) {
          unstable_batchedUpdates(() => {
            this.pendingAttempt!(false);
            this.pendingAttempt = undefined;
          });
        }
      }
    }
  }

  currentData(): GameData {
    return this.data!;
  }

  onChange(callback: () => void): void {
    this.listener = callback;
  }

  attemptPlayerAction(action: GameAttempt) {
    this.ws!.send({ type: GameMessageType.GameAttemptRequest, action });
    return new Promise<boolean>((resolve) => {
      this.pendingAttempt = resolve;
    });
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = undefined;
  }

  get viewOrder() {
    return this.player!;
  }
}
