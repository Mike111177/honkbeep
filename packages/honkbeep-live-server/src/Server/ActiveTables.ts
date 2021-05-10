import { User } from "honkbeep-protocol/types/User";
import { UID } from "honkbeep-util/rng";
import { Table } from "../Table/Table";

const ActiveTables = new Map<string, Table>();

export function createNewTable(player: User) {
  const table = new Table();
  const id = UID();
  ActiveTables.set(id, table);
  return id;
}

export function getActiveTable(id: string) {
  return ActiveTables.get(id);
}
