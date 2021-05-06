import axios from "axios";
import { MeMessage, StatusMessage } from "../backend/types/ApiMessages";
import { GameMessage } from "../backend/types/GameMessages";
import { LobbyMessage } from "../backend/types/LobbyMessage";
import { MessageSocket } from "../util/MessageSocket";

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

export function login(name: string) {
  return axios.post("/api/login", { name });
}

export function game(id: string) {
  return new MessageSocket<GameMessage>(
    new WebSocket(`${wsproto}://${window.location.host}/api/game/${id}`)
  );
}

export function lobby() {
  return new MessageSocket<LobbyMessage>(
    new WebSocket(`${wsproto}://${window.location.host}/api/lobby`)
  );
}
