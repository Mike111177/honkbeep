import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import LocalBackend from "./game/LocalBackend";
import ReactUIInterface from "./ui/ReactFrontendInterface";
import HBBoard from './ui/HBBoard/HBBoard';

import background from "./background_black.jpg";
import './App.scss';
import LocalServer from './game/LocalServer';

const gamedef = {
  variant: {
    suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
    numPlayers: 4,
    handSize: 4
  },
  playerNames: ["Alice", "Bob", "Cathy", "Donald"]
};

//Create virtual local Server 
const server = new LocalServer(gamedef);

//For debugging:
(window as any).HONKPlayRandom = () => {
  const HONKER = server as any;
  const turn = HONKER.state.turn;
  const player = (turn - 1) % 4;
  const card = HONKER.cardFromHand(player, Math.floor(Math.random() * 4));
  return HONKER.attemptPlayerAction(player, { type: 2, card});
};


//Connect to local server as player 0
const backend = new LocalBackend(0, server);

//Attach UI interface to backend adapter
const UIInterface = new ReactUIInterface(backend);

function App() {
  //State to wait for 
  const [attach, setAttach] = useState<undefined | ReactUIInterface>(undefined);

  useEffect(() => {
    UIInterface.onReady(() => setAttach(UIInterface));
  }, [UIInterface]);

  return (
    <Router>
      <div className="App" style={{ backgroundImage: `url(${background})` }}>
        <Route exact path="/">
          <Redirect to="/game" />
        </Route>
        <Route path="/game">
          {attach !== undefined ? <HBBoard game={attach} /> : <></>}
        </Route>
      </div>
    </Router>
  );
}

export default App;
