import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

import styles from "./index.css";
import "./colortheme.css";

function launchApp() {
  const root = document.createElement("div");
  root.setAttribute("class", styles.root);
  document.body.appendChild(root);
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    root
  );
  reportWebVitals();
}

launchApp();
