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
import { UID } from "honkbeep-util/rng";
import * as ArrayUtil from "honkbeep-util/ArrayUtil";

const ActiveTables = new Map<string, Table>();

export function createNewTable(player: number) {
  const id = UID();
  const table = new Table(id, player);
  ActiveTables.set(id, table);
  return id;
}

export function listTables() {
  return ActiveTables.entries();
}

export function getActiveTable(id: string) {
  return ActiveTables.get(id);
}

class Table {
  id: string;
  sockets: MessageSocket<TableMessage, WebSocket>[] = [];
  state: TableState;
  constructor(id: string, leader: number) {
    this.id = id;
    this.state = { leader, players: [] };
  }

  //Setup for new websockets
  addUser(ws: WebSocket, { name, id }: User) {
    const mws = new MessageSocket<TableMessage, WebSocket>(ws);

    //When this socket closes, delete record of socket for GC
    mws.onclose = () => {
      ArrayUtil.remove(this.sockets, mws);
    };

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
            this.close();
            ActiveTables.delete(this.id);
          }
      }
    };

    if (this.state.players.find((user) => id === user.id) === undefined) {
      this.state.players.push({ id, name });
    }

    this.sockets.push(mws);
    this.sockets.forEach((s) => {
      s.send({ type: TableMessageType.TableUpdate, state: this.state });
    });
  }

  close() {
    this.sockets.forEach((ws) => ws.close());
  }
}
