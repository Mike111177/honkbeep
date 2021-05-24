import axios from "axios";
import { MeMessage, StatusMessage } from "honkbeep-protocol/types/ApiMessages";
import { GameMessage } from "honkbeep-protocol/types/GameMessages";
import { TableMessage, TableState } from "honkbeep-protocol/types/TableMessage";
import { MessageSocket } from "honkbeep-util";

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

export async function createTable() {
  return (await axios.get("/api/table/create")).data.id;
}

export async function listTables() {
  return (
    await axios.get<
      {
        id: string;
        state: TableState;
      }[]
    >("/api/table/list")
  ).data;
}

export function login(username: string, password: string) {
  return axios.post("/api/login", { username, password });
}

export function game(id: string) {
  return new MessageSocket<GameMessage>(
    new WebSocket(`${wsproto}://${window.location.host}/api/game/${id}`)
  );
}

export function joinTable(id: string) {
  return new MessageSocket<TableMessage>(
    new WebSocket(`${wsproto}://${window.location.host}/api/table/join/${id}`)
  );
}
