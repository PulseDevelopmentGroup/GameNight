import React, { useEffect } from "react";
import { useGetRoomCodeQuery } from "../generated/graphql";
import { useHistory } from "react-router-dom";

export const RoomLobby = () => {
  const history = useHistory();
  const { data } = useGetRoomCodeQuery();

  const roomCode = data?.currentRoom;

  useEffect(() => {
    if (!roomCode) {
      history.push("/");
    }
  }, [roomCode, history]);

  return <div>Welcome to the lobby :D</div>;
};
