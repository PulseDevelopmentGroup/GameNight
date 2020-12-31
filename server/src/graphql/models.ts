import { ObjectID } from "mongodb";

export type UserModel = {
  _id: ObjectID;
  username: string;
  image?: URL;
  player?: ObjectID;
  room?: ObjectID;
  token?: string;
};

export type RoomModel = {
  _id: ObjectID;
  code: string;
  leader: ObjectID;
  users: ObjectID[];

  currentGame?: ObjectID;

  gameVotes: ObjectID[];
  gameHistory?: ObjectID;

  dateCreated: Date;
};
