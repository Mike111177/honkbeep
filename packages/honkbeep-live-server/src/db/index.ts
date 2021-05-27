import { Pool } from "pg";
import createTables from "./createTables.sql";
const pool = new Pool();

export function query(text: string, params?: any) {
  return pool.query(text, params);
}

export async function initDB() {
  await query(createTables);
}

export * from "./sessions";
