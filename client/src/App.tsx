import React, { useEffect } from "react";
import { Route, useHistory, Switch } from "react-router-dom";
import { Welcome } from "./Welcome";
import { Codenames } from "./games/Codenames";
import { Spyfall } from "./games/Spyfall";
import { RoomLobby } from "./room/RoomLobby";
import { gql } from "@apollo/client";
import { useGetRoomCodeQuery } from "./generated/graphql";

const GET_CURRENT_ROOM = gql`
  query GetRoomCode {
    currentRoom @client
  }
`;

function App() {
  const history = useHistory();
  const { data } = useGetRoomCodeQuery();

  const currentRoom = data?.currentRoom;

  useEffect(() => {
    if (currentRoom) {
      history.push(`/r/${currentRoom}`);
    }
  }, [currentRoom, history]);

  return (
    <div className="flex flex-col h-screen top-0 right-0 bottom-0 left-0 bg-gray-800">
      <div className="flex-none h-16">This is logo</div>
      <div className="flex-grow flex">
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/r/:roomCode" component={RoomLobby} />
          <Route path="/spyfall" component={Spyfall} />
          <Route path="/codenames" component={Codenames} />
        </Switch>
      </div>
      <div className="flex-none h-16">This is github logo</div>
    </div>
  );
}

export default App;
