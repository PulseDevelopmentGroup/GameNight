import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Welcome } from "./Welcome";
import { Codenames } from "./games/Codenames";
import { Spyfall } from "./games/Spyfall";
import { Sidebar } from "./components/Sidebar";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen top-0 right-0 bottom-0 left-0 bg-gray-800">
        <div className="flex-none h-16">This is logo</div>
        <div className="flex-grow flex flex-row">
          <div className="flex-none">
            <Sidebar />
          </div>
          <div className="flex flex-grow justify-center ml-12 mr-12">
            <Route exact path="/" component={Welcome} />
            <Route path="/spyfall" component={Spyfall} />
            <Route path="/codenames" component={Codenames} />
          </div>
        </div>
        <div className="flex-none h-16">This is github logo</div>
      </div>
    </Router>
  );
}

export default App;
