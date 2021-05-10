import WebSocket from "ws";
import { User } from "honkbeep-protocol/types/User";
import { VariantDefinition } from "honkbeep-game";
import { GameServerBackend } from "./GameServerBackend";
import ServerBoard from "honkbeep-protocol/ServerBoard";

export class GameInstanceManager {
  private board: ServerBoard;
  private players: User[];

  constructor(players: User[], variant: VariantDefinition) {
    this.players = players;
    this.board = new ServerBoard(
      variant,
      players.map((p) => p.name)
    );
  }

  addUserConnection(socket: WebSocket, user?: User) {
    new GameServerBackend(
      socket,
      this.players.findIndex(({ id }) => id === user!.id),
      this.board
    );
  }
}
