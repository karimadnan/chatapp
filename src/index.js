import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Main from "./App";
import Chat from "./components/Chat";
import NavBar from "./components/navBar";
import Notfound from "./components/Notfound";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App({ location }) {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route location={location} path="/chat" exact component={Chat} />
        <Route location={location} path="/" exact component={Main} />
        <Route component={Notfound} />
      </Switch>
    </div>
  );
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
