import React from "react";
import { useForm } from "react-hook-form";
import { TextField } from "./components/inputs/TextField";
import { Button } from "./components/Button";
import { cx, css } from "emotion";

export const Welcome = () => {
  const { register, handleSubmit /*, errors*/ } = useForm();

  const onSubmit = (values: Record<string, any>) => {
    console.log(values);
  };

  return (
    <div>
      <form
        className={cx(
          "bg-gray-700 rounded-lg p-8 py-4 space-y-2 shadow-lg",
          css({
            width: "24rem",
          })
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-gray-500 text-3xl">Join a Room</h1>
        <TextField
          label="Room Code"
          name="code"
          className="w-32"
          register={register}
        />
        <TextField
          label="Username"
          name="username"
          fullWidth
          register={register}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">Join</Button>
        </div>
        <h1 className="text-gray-500 text-3xl">Create a Room</h1>
        <TextField
          label="Username"
          name="username"
          fullWidth
          register={register}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">Create</Button>
        </div>
      </form>
    </div>
  );
};
