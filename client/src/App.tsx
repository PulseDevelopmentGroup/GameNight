import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Welcome } from "./Welcome";

function App() {
  return (
    <Router>
      <div className="fixed top-0 right-0 bottom-0 left-0 bg-gray-800">
        <Route path="/" component={Welcome} />
        Heyo, I'm the app
      </div>
    </Router>
  );
}

export default App;
