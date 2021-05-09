import { BrowserRouter as Router, Route } from "react-router-dom";
import loadable from "@loadable/component";

import { ErrorBoundary } from "honkbeep-react";

import Home from "./pages/Home";
import Table from "./pages/Table";
import Login from "./pages/Login";
import StatusIndicator from "./components/StatusIndicator";
import LoggedInGuard from "./components/LoggedInGuard";

import styles from "./App.css";

const Game = loadable(() => import("./pages/Game"));
const Solitaire = loadable(() => import("./pages/Solitaire"));
const SplitScreen = loadable(() => import("./pages/SplitScreen"));

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
