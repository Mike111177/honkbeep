import { Pool } from "pg";
import * as Queries from "./Queries";
const pool = new Pool();

export function query(text: string, params?: any) {
  return pool.query(text, params);
}

export async function initDB() {
  await query(Queries.createTables);
}

export * from "./sessions";
