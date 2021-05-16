import { query } from "../db";
import { Router } from "../types/ServerTypes";
import { compare, hash } from "bcrypt";

export default function loginRoute(router: Router) {
  router.post("/login", async (ctx, next) => {
    const { username, password: PLAINTEXT_PASSWORD } = ctx.request.body;
    if (username.length < 3) {
      ctx.response.status = 400;
      ctx.response.body = "Please choose longer name.";
    } else {
      //See if this user exist
      const getUserQ = await query(
        `SELECT user_id, username, password FROM accounts WHERE username=$1`,
        [username]
      );
      if (getUserQ.rowCount === 0) {
        //If not lets make a new user and log them in
        const ENCRYPTED_PASSWORD = await hash(PLAINTEXT_PASSWORD, 10);
        const createUserQ = await query(
          `INSERT INTO accounts (username, password) VALUES ($1, $2) RETURNING user_id`,
          [username, ENCRYPTED_PASSWORD]
        );
        ctx.session!.user = createUserQ.rows[0].user_id;
        ctx.body = ctx.session!.user;
      } else {
        //Else we need to check the password
        const ENCRYPTED_PASSWORD = getUserQ.rows[0].password;
        if (await compare(PLAINTEXT_PASSWORD, ENCRYPTED_PASSWORD)) {
          ctx.session!.user = getUserQ.rows[0].user_id;
          ctx.body = ctx.session!.user;
        } else {
          //Bad password
          ctx.body = "Wrong password.";
          ctx.status = 403;
        }
      }
    }
    await next();
  });
  router.get("/logout", (ctx, next) => {
    ctx.session = null;
    ctx.body = "😃";
  });
}
