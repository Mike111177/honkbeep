import axios from "axios";
import { MeMessage, StatusMessage } from "../backend/types/ApiMessages";
import { GameMessage } from "../backend/types/GameMessages";
import { LobbyMessage } from "../backend/types/LobbyMessage";
import { MessageSocket } from "../util/MessageSocket";

export function me() {
  return axios.get<MeMessage>("/api/me").then(({ data }) => data);
}

export function status() {
  return axios.get<StatusMessage>("/api/status").then(({ data }) => data);
}

export function login(name: string) {
  return axios.post("/api/login", { name });
}

export function game() {
  return new MessageSocket<GameMessage>(
    new WebSocket(`ws://${window.location.host}/api/game`)
  );
}

export function lobby() {
  return new MessageSocket<LobbyMessage>(
    new WebSocket(`ws://${window.location.host}/api/lobby`)
  );
}
