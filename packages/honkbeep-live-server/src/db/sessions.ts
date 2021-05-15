import { query } from ".";
import session from "koa-session";

export function sessionConfig(): Partial<session.opts> {
  return {
    key: "session",
    signed: false,
    store: {
      async get(key) {
        const getSessQ = await query(
          `SELECT sessions.user_id, username 
           FROM sessions
           INNER JOIN accounts 
           ON accounts.user_id=sessions.user_id
           WHERE sess_id=$1`,
          [key]
        );
        if (getSessQ.rowCount > 0) {
          return {
            user: {
              id: getSessQ.rows[0].user_id,
              name: getSessQ.rows[0].username,
            },
          };
        }
      },
      async set(key, sess) {
        if (sess.user !== undefined) {
          await query(
            "INSERT INTO sessions (sess_id, user_id) VALUES ($1, $2)",
            [key, sess.user]
          );
        }
      },
      async destroy() {},
    },
  };
}
