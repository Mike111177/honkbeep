import { Pool } from "pg";
import schema from "./schema.sql";
const pool = new Pool();

export function query(text: string, params?: any) {
  return pool.query(text, params);
}

export async function initDB() {
  await query(schema);
}

export * from "./sessions";
