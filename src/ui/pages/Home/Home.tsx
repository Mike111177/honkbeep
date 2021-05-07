import { useHistory } from "react-router-dom";
import { HomeStyles as styles } from ".";
import BoxButton from "../../components/BoxButton";

export default function Home() {
  const history = useHistory();
  return (
    <div className={styles.Home}>
      <BoxButton
        onClick={() => {
          history.push("/table");
        }}
      >
        Join Table
      </BoxButton>
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
