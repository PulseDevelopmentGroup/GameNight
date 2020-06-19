import React from "react";
import { useForm } from "react-hook-form";

export const Welcome = () => {
  const { register, handleSubmit /*, errors*/ } = useForm();

  const onSubmit = (values: Record<string, any>) => {
    console.log(values);
  };

  return (
    <div>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Room Code
          <input name="roomCode" ref={register} />
        </label>
        <label>
          Name
          <input name="username" ref={register} />
        </label>
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};
