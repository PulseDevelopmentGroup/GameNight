import React from "react";
import { useForm } from "react-hook-form";
import { TextField } from "./components/inputs/TextField";
import { Button } from "./components/Button";
import { cx, css } from "emotion";
import { JoinRoomInput, CreateRoomInput } from "./generated/graphql";

export const Welcome = () => {
  const {
    register: registerJoin,
    handleSubmit: handleJoinSubmit /*, errors*/,
  } = useForm<JoinRoomInput>();

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
  } = useForm<CreateRoomInput>();

  const onJoin = (values: JoinRoomInput) => {
    console.log("ima join");
    console.log(values);
  };

  const onCreate = (values: CreateRoomInput) => {
    console.log("create :D");
    console.log(values);
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={cx(
          "bg-gray-700 rounded-lg p-8 py-4 space-y-2 shadow-lg",
          css({
            width: "24rem",
          })
        )}
      >
        <form onSubmit={handleJoinSubmit(onJoin)}>
          <h1 className="text-gray-500 text-3xl">Join a Room</h1>
          <TextField
            label="Room Code"
            name="roomCode"
            className="w-32"
            register={registerJoin}
          />
          <TextField
            label="Username"
            name="username"
            fullWidth
            register={registerJoin}
          />
          <div className="flex justify-end pt-4">
            <Button type="submit">Join</Button>
          </div>
        </form>
        <form onSubmit={handleCreateSubmit(onCreate)}>
          <h1 className="text-gray-500 text-3xl">Create a Room</h1>
          <TextField
            label="Username"
            name="username"
            fullWidth
            register={registerCreate}
          />
          <div className="flex justify-end pt-4">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
