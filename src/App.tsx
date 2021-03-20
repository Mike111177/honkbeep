import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import HBClientBoard from "./ui/HBBoard/HBClientBoard";

import background from "./background_black.jpg";
import "./App.scss";

//Attach UI interface to backend adapter
function App() {
  return (
    <Router>
      <div className="App" style={{ backgroundImage: `url(${background})` }}>
        <Route exact path="/">
          <Redirect to="/game" />
        </Route>
        <Route path="/game">
          <HBClientBoard />
        </Route>
      </div>
    </Router>
  );
}

export default App;
