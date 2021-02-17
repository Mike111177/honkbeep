import React from 'react'
import HBBoard from './game/HBBoard/HBBoard'

import background from "./background_black.jpg"
import './App.css';


function App() {
  return (
    <div className="App" style={{ backgroundImage: `url(${background})` }}>
        <HBBoard/>
    </div>
  );
}

export default App;
