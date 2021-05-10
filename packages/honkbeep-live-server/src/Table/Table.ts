import WebSocket from "ws";
import {
  TableMessage,
  TableMessageType,
  TableState,
} from "honkbeep-protocol/types/TableMessage";
import { User } from "honkbeep-protocol/types/User";
import { genericVariant } from "honkbeep-game";
import { MessageSocket } from "honkbeep-util/MessageSocket";
import { startNewGame } from "../Server/ActiveGames";

export class Table {
  sockets: MessageSocket<TableMessage, WebSocket>[] = [];
  state: TableState = { leader: 0, players: [] };
  addUser(ws: WebSocket, { name, id }: User) {
    const mws = new MessageSocket<TableMessage, WebSocket>(ws);
    mws.onmessage = (msg) => {
      switch (msg.type) {
        case TableMessageType.TableStartRequest:
          if (id === this.state.leader) {
            const gameid = startNewGame(
              this.state.players,
              genericVariant({ numPlayers: this.state.players.length })
            );
            this.sockets.forEach((s) => {
              s.send({ type: TableMessageType.GameStartNotification, gameid });
            });
          }
      }
    };
    if (this.state.players.length === 0) {
      this.state.leader = id;
    }
    if (this.state.players.find((user) => id === user.id) === undefined) {
      this.state.players.push({ id, name });
    }
    this.sockets.push(mws);
    this.sockets.forEach((s) => {
      s.send({ type: TableMessageType.TableUpdate, state: this.state });
    });
  }
}
