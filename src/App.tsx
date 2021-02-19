import React from 'react'
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom"

import { GameTracker } from "./game/Game"
import LocalBackend from "./game/LocalBackend"
import { GameUIInterface } from "./ui/ReactFrontendInterface"
import HBBoard from './ui/HBBoard/HBBoard'

import background from "./background_black.jpg"
import './App.scss';


function App() {
  return (
    <Router>
      <div className="App" style={{ backgroundImage: `url(${background})` }}>
        <Route exact path="/">
          <Redirect to="/game" />
        </Route>
        <Route path="/game">
          {() => {
            const uiInterface = new GameUIInterface();
            const localGame = new LocalBackend({
              variant: {
                suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
                numPlayers: 4,
                handSize: 5
              },
              playerNames: ["Alice", "Bob", "Cathy", "Donald"]
            });
            const game = new GameTracker(localGame, uiInterface);
            game.useShuffler();
            return <HBBoard game={uiInterface} />
          }}
        </Route>
      </div>
    </Router>
  );
}

export default App;
