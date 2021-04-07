import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Home, LoginPage } from "./ui/pages";

import background from "./background_black.jpg";
import styles from "./App.module.css";

/*
import HBSolitaireBoard from "./ui/HBBoard/HBSolitaireBoard";
/**/
//*
// @ts-ignore
import loadable from "@loadable/component";
const HBSolitaireBoard = loadable(
  () => import("./ui/HBBoard/HBSolitaireBoard")
);
/**/

//Attach UI interface to backend adapter
function App() {
  return (
    <Router>
      <div
        className={styles.App}
        style={{ backgroundImage: `url(${background})` }}
      >
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/solitaire">
          <HBSolitaireBoard />
        </Route>
      </div>
    </Router>
  );
}

export default App;
