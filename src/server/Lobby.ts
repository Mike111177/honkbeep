import WebSocket from "ws";
import {
  LobbyMessage,
  LobbyMessageType,
  LobbyState,
} from "../backend/types/LobbyMessage";
import { User } from "../backend/types/User";
import { genericVariant } from "../game";
import { MessageSocket } from "../util/MessageSocket";
import { startNewGame } from "./ActiveGames";

export class Lobby {
  sockets: MessageSocket<LobbyMessage, WebSocket>[] = [];
  state: LobbyState = { leader: 0, players: [] };
  addUser(ws: WebSocket, { name, id }: User) {
    const mws = new MessageSocket<LobbyMessage, WebSocket>(ws);
    mws.onmessage = (msg) => {
      switch (msg.type) {
        case LobbyMessageType.LobbyStartRequest:
          if (id === this.state.leader) {
            const gameid = startNewGame(
              this.state.players,
              genericVariant({ numPlayers: this.state.players.length })
            );
            this.sockets.forEach((s) => {
              s.send({ type: LobbyMessageType.GameStartNotification, gameid });
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
      s.send({ type: LobbyMessageType.LobbyUpdate, state: this.state });
    });
  }
}
