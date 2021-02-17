import React from 'react'
import HBBoard from './game/HBBoard/HBBoard'
import { Route, Redirect } from "react-router-dom"

import background from "./background_black.jpg"
import './App.scss';


function App() {
  return (
    <div className="App" style={{ backgroundImage: `url(${background})` }}>
      <Route exact path="/">
        <Redirect to="/game"/>
      </Route>
      <Route path="/game">
        <HBBoard />
      </Route>
    </div>
  );
}

export default App;
