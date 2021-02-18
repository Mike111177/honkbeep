import React from 'react'
import { Route, Redirect } from "react-router-dom"

import {GameTracker} from "./game/Game"
import {GameUIInterface} from "./ui/ReactFrontendInterface"
import HBBoard from './ui/HBBoard/HBBoard'

import background from "./background_black.jpg"
import './App.scss';


function App() {
  return (
    <div className="App" style={{ backgroundImage: `url(${background})` }}>
      <Route exact path="/">
        <Redirect to="/game"/>
      </Route>
      <Route path="/game">
        {()=>{
            const gameInterface = new GameUIInterface();
            const game = new GameTracker({
                variant: {
                    suits: ["Red", "Yellow", "Green", "Blue", "Purple"],
                    numPlayers: 4,
                    handSize: 5
                },
                playerNames: ["Alice", "Bob", "Cathy", "Donald"]
            }, gameInterface);
            game.useShuffler();
          return <HBBoard game={gameInterface}/>
        }}
      </Route>
    </div>
  );
}

export default App;
