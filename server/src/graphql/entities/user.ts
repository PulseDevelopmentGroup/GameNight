import "reflect-metadata";
import { prop as Property } from "@typegoose/typegoose";
import { Authorized, Field, ObjectType } from "type-graphql";
import { ObjectId } from "mongodb";
import { getModel } from "../helpers";
import { URL } from "url";
import { Auth } from "./auth";

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
}

export const UserModel = getModel(User, "users");
