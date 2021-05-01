import { useHistory } from "react-router-dom";
import BoxButton from "../../components/BoxButton";
import styles from "./LoginPage.css";

export default function LoginPage() {
  const history = useHistory();
  return (
    <div className={styles.LoginPage}>
      <label htmlFor="username">Username or Email:</label>
      <br />
      <input type="text" id="username" name="username"></input>
      <br />
      <label htmlFor="password">Password:</label>
      <br />
      <input type="password" id="password" name="password"></input>
      <BoxButton
        onClick={() => {
          history.push("/game");
        }}
      >
        Login
      </BoxButton>
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
