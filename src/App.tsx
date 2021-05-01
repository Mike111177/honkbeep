import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
// @ts-ignore
import loadable from "@loadable/component";

import LoginPage from "./ui/pages/LoginPage";
import Home from "./ui/pages/Home";

import styles from "./App.css";
import { ErrorBoundary } from "./ui/util/ErrorBoundry";
import StatusIndicator from "./ui/components/StatusIndicator";

const Game = loadable(() => import("./ui/pages/Game"));
const Solitaire = loadable(() => import("./ui/pages/Solitaire"));
const SplitScreen = loadable(() => import("./ui/pages/SplitScreen"));

//Attach UI interface to backend adapter
function App() {
  return (
    <Router>
      <div className={styles.App}>
        <ErrorBoundary>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/game">
            <Game />
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
        <ErrorBoundary>
          <StatusIndicator />
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
