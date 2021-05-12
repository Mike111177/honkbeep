import axios from "axios";
import { MeMessage, StatusMessage } from "honkbeep-protocol/types/ApiMessages";
import { GameMessage } from "honkbeep-protocol/types/GameMessages";
import { TableMessage } from "honkbeep-protocol/types/TableMessage";
import { MessageSocket } from "honkbeep-util/MessageSocket";

const wsproto = window.location.protocol === "https:" ? "wss" : "ws";

export async function me() {
  try {
    const response = await axios.get<MeMessage>("/api/me");
    return response.data;
  } catch {
    return undefined;
  }
}

export async function status() {
  try {
    const response = await axios.get<StatusMessage>("/api/status");
    return response.data;
  } catch {
    return undefined;
  }
}

export function login(username: string, password: string) {
  return axios.post("/api/login", { username, password });
}

export function game(id: string) {
  return new MessageSocket<GameMessage>(
    new WebSocket(`${wsproto}://${window.location.host}/api/game/${id}`)
  );
}

export function table() {
  return new MessageSocket<TableMessage>(
    new WebSocket(`${wsproto}://${window.location.host}/api/table`)
  );
}
