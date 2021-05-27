import { query } from ".";
import session from "koa-session";

import getSession from "./getSession.sql";
import createSession from "./createSession.sql";

export function sessionConfig(): Partial<session.opts> {
  return {
    key: "session",
    signed: false,
    store: {
      async get(key) {
        const getSessQ = await query(getSession, [key]);
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
          await query(createSession, [key, sess.user]);
        }
      },
      async destroy() {},
    },
  };
}
