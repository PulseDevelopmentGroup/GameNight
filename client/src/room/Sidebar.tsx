import React from "react";
import {
  useGetRoomCodeQuery,
  useGetRoomDetailsQuery,
  User,
} from "../generated/graphql";
import { cx, css } from "emotion";
import { Menu, DotsVertical, User as UserIcon } from "heroicons-react";
import { gql } from "@apollo/client";

const GET_ROOM_DETAILS = gql`
  query GetRoomDetails($code: String!) {
    roomByCode(code: $code) {
      leader {
        id
      }
      users {
        id
        nickname
        image
      }
    }
  }
`;

export const Sidebar = () => {
  const { data: codeData } = useGetRoomCodeQuery();

  const { data: roomData } = useGetRoomDetailsQuery({
    variables: {
      code: codeData?.currentRoom as string,
    },
  });

  return (
    <div
      className={cx(
        "grid row-gap-4 h-full bg-gray-700 rounded-r-lg items-center p-4",
        css({
          gridTemplateColumns: "1fr 2rem",
          gridAutoRows: "2rem",
        })
      )}
    >
      <div className="text-gray-600 font-light">Players</div>
      <Menu
        className={cx(
          "text-teal-600 w-8 h-8",
          css({
            justifySelf: "end",
          })
        )}
      />

      {roomData?.roomByCode?.users.map((user) => {
        return user && <UserEntry key={user.id} user={user} />;
      })}
    </div>
  );
};

interface UserEntryProps {
  user: Pick<User, "id" | "nickname" | "image">;
}

const UserEntry = ({ user }: UserEntryProps) => {
  return (
    <>
      <div className="flex items-center text-lg text-gray-400">
        {user.image ? (
          <div>TODO</div>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800">
            <UserIcon className="text-gray-700" />
          </div>
        )}
        <span className="ml-3">{user.nickname}</span>
      </div>
      <DotsVertical
        className={cx(
          "text-gray-600",
          css({
            justifySelf: "center",
          })
        )}
      />
    </>
  );
};
