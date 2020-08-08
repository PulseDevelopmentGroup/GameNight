import React, { useEffect } from "react";
import { useGetRoomCodeQuery } from "../generated/graphql";
import { useHistory } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { cx, css } from "emotion";
import { RoomTag } from "./RoomTag";

export const RoomLobby = () => {
  const history = useHistory();
  const { data } = useGetRoomCodeQuery();

  const roomCode = data?.currentRoom;

  useEffect(() => {
    if (!roomCode) {
      history.push("/");
    }
  }, [roomCode, history]);

  if (!roomCode) {
    return null;
  }

  return (
    <div
      className={cx(
        "flex-1 grid",
        css({
          gridTemplateColumns: "16rem 1fr",
        })
      )}
    >
      <RoomTag roomCode={roomCode} />
      <Sidebar />
      Welcome to the lobby :D
    </div>
  );
};
