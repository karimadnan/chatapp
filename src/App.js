import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

function App({ location }) {
  return (
    <div className="App">
      <h1>Chat App</h1>
      <Link to={"/chat"}>
        <button style={{ margin: 3 }}>Chat with strangers</button>
      </Link>
    </div>
  );
}

export default App;
