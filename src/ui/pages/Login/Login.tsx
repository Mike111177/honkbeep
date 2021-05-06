import * as Api from "../../../client/Api";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import BoxButton from "../../components/BoxButton";
import styles from "./Login.css";

export default function Login() {
  const history = useHistory();
  const username = useRef<HTMLInputElement>(null);
  const [loginError, setLoginError] = useState("");
  useEffect(() => {
    Api.me().then((result) => {
      if (result.user !== undefined) {
        history.push("/");
      }
    });
  }, [history]);
  return (
    <div className={styles.Login}>
      <label htmlFor="username">Username or Email:</label>
      <br />
      <input ref={username} type="text" id="username" name="username"></input>
      <br />
      <label htmlFor="password">Password:</label>
      <br />
      <input
        type="password"
        id="password"
        name="password"
        disabled={true}
      ></input>
      <BoxButton
        onClick={async () => {
          const name = username.current?.value;
          try {
            await Api.login(name || "");
            setLoginError("");
            history.push("/");
          } catch (error) {
            console.log(error);
            setLoginError(error.response!.data);
          }
        }}
      >
        Login
      </BoxButton>
      {loginError.length > 0 ? (
        <span className={styles.Error}>{loginError}</span>
      ) : undefined}
      <br />
      <span>Or play solitaire by yourself</span>
      <BoxButton
        onClick={() => {
          history.push("/solitaire");
        }}
      >
        Play Solitaire
      </BoxButton>
      <BoxButton
        onClick={() => {
          history.push("/splitscreen");
        }}
      >
        Play 4 Player splitscreen
      </BoxButton>
    </div>
  );
}
