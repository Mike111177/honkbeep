import { User } from "../backend/types/User";
import { VariantDefinition } from "../game";
import ServerBoard from "./ServerBoard";
import WebSocket from "ws";
import { GameServerBackend } from "./GameServerBackend";

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
