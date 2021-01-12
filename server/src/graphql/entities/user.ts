import "reflect-metadata";
import { DocumentType, prop as Property } from "@typegoose/typegoose";
import { Authorized, Field, ObjectType } from "type-graphql";
import { ObjectId } from "mongodb";
import { getModel } from "../helpers";
import { URL } from "url";
import { Auth } from "./auth";
import { Room, RoomModel } from "./room";

@ObjectType()
export class User {
  @Authorized(["ADMIN"])
  @Field()
  readonly _id: ObjectId;

  @Authorized()
  @Field()
  @Property({ required: true })
  username: string;

  @Field({ nullable: true })
  @Property()
  nickname?: string;

  @Field()
  @Property({ required: true })
  accountCreated: Date;

  @Field()
  @Property({ required: true })
  lastLogin: Date;

  @Authorized()
  @Field({ nullable: true })
  @Property()
  image?: URL;

  @Authorized(["ADMIN"])
  @Property({ type: () => [String], required: true, default: ["USER"] })
  roles: string[];

  @Authorized(["ADMIN"])
  @Field((type) => Auth, { nullable: true })
  @Property()
  auth?: Auth;

  public async getRoom(this: DocumentType<User>): Promise<Room> {
    return new Promise<Room>(async (res, rej) => {
      const room = await RoomModel.findOne({ $in: { members: this._id } });

      if (room) return res(room);
      return rej("User not found in any rooms");
    });
  }
}

export const UserModel = getModel(User, "users");
