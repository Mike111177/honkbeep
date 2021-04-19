import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
// @ts-ignore
import loadable from "@loadable/component";

import LoginPage from "./ui/pages/LoginPage";
import Home from "./ui/pages/Home";

import background from "./background_black.jpg";
import styles from "./App.css";
import { ErrorBoundary } from "./ui/util/ErrorBoundry";

const Solitaire = loadable(() => import("./ui/pages/Solitaire"));
const SplitScreen = loadable(() => import("./ui/pages/SplitScreen"));

//Attach UI interface to backend adapter
function App() {
  return (
    <Router>
      <div
        className={styles.App}
        style={{ backgroundImage: `url(${background})` }}
      >
        <ErrorBoundary>
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
            <Solitaire />
          </Route>
          <Route path="/splitscreen">
            <SplitScreen />
          </Route>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
