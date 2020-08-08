import React, { useEffect } from "react";
import { useGetRoomCodeQuery } from "../generated/graphql";
import { useHistory } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { cx, css } from "emotion";

export const RoomLobby = () => {
  const history = useHistory();
  const { data } = useGetRoomCodeQuery();

  const roomCode = data?.currentRoom;

  useEffect(() => {
    if (!roomCode) {
      history.push("/");
    }
  }, [roomCode, history]);

  return (
    <div
      className={cx(
        "flex-1 grid",
        css({
          gridTemplateColumns: "16rem 1fr",
        })
      )}
    >
      <Sidebar />
      Welcome to the lobby :D
    </div>
  );
};
