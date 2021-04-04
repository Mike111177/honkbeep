import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import HBSolitaireBoard from "./ui/HBBoard/HBSolitaireBoard";

import background from "./background_black.jpg";
import styles from "./App.module.css";

//Attach UI interface to backend adapter
function App() {
  return (
    <Router>
      <div
        className={styles.App}
        style={{ backgroundImage: `url(${background})` }}
      >
        <Route exact path="/">
          <Redirect to="/game" />
        </Route>
        <Route path="/game">
          <HBSolitaireBoard />
        </Route>
      </div>
    </Router>
  );
}

export default App;
