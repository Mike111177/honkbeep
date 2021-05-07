import { BrowserRouter as Router, Route } from "react-router-dom";
// @ts-ignore
import loadable from "@loadable/component";

import Home from "./ui/pages/Home";
import Table from "./ui/pages/Table";
import Login from "./ui/pages/Login";

import styles from "./App.css";
import { ErrorBoundary } from "./ui/util/ErrorBoundry";
import StatusIndicator from "./ui/components/StatusIndicator";
import LoggedInGuard from "./ui/components/LoggedInGuard";

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
            <LoggedInGuard>
              <Home />
            </LoggedInGuard>
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/table">
            <LoggedInGuard>
              <Table />
            </LoggedInGuard>
          </Route>
          <Route path="/game">
            <LoggedInGuard>
              <Game />
            </LoggedInGuard>
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
