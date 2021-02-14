import background from "./background_black.jpg"
import './App.css';

import HBBoard from './game/HBBoard/HBBoard'


function App() {
  return (
    <div className="App" style={{ backgroundImage: `url(${background})` }}>
      <HBBoard/>
    </div>
  );
}

export default App;
