import React from "react";
import { cx, css } from "emotion";

interface RoomTagProps {
  roomCode: string;
}

export const RoomTag = ({ roomCode }: RoomTagProps) => {
  return (
    <div
      className={cx(
        "rounded-l-full bg-gray-700 px-4 py-1",
        css({
          position: "absolute",
          top: 16,
          right: 0,
        })
      )}
    >
      <span className="text-gray-600 uppercase text-sm mr-1">Room:</span>
      <span className="text-teal-500">{roomCode}</span>
    </div>
  );
};
