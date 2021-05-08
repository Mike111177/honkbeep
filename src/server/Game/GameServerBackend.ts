import { GameMessage, GameMessageType } from "../../backend/types/GameMessages";
import { MessageSocket } from "../../util/MessageSocket";
import { GameClientConnection } from "../types/GameClientConnection";
import WebSocket from "ws";
import { GameEventMessage } from "../../backend/types/GameData";
import ServerBoard from "./ServerBoard";

/**Liaison for game client over websocket */
export class GameServerBackend implements GameClientConnection {
  player: number;
  private board: ServerBoard;
  private ws: MessageSocket<GameMessage, WebSocket>;

  constructor(rws: WebSocket, player: number, board: ServerBoard) {
    const ws = new MessageSocket(rws);
    const connector = this;
    const onMessage = this.onMessage.bind(this);
    async function handleWebsocket() {
      connector.ws.onmessage = async () => {
        connector.ws.onmessage = onMessage;
        connector.ws.send({
          type: GameMessageType.GameDataResponse,
          data: await board.requestInitialState(player),
        });
        board.connect(connector);
      };
      ws.send({ type: GameMessageType.GameServerReady, player });
    }
    this.ws = ws;
    this.player = player;
    this.board = board;
    handleWebsocket();
  }

  async onMessage(msg: GameMessage) {
    switch (msg.type) {
      case GameMessageType.GameAttemptRequest: {
        const result = await this.board.attemptPlayerAction(
          this.player,
          msg.action
        );
        if (!result) {
          this.ws.send({ type: GameMessageType.GameAttemptRejected });
        }
      }
    }
  }

  callback(msg: GameEventMessage) {
    this.ws.send({ type: GameMessageType.GameEventNotification, event: msg });
  }
}
