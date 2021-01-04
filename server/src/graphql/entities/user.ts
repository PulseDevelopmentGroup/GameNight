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

  @Authorized()
  @Field({ nullable: true })
  @Property()
  image?: URL;

  // TODO: Take a closer look at these fields, they may not be required to be part of the GQL schema
  @Authorized(["ADMIN"])
  @Property({ type: () => [String], required: true, default: ["USER"] })
  roles: string[];

  @Authorized(["ADMIN"])
  @Field((type) => Auth, { nullable: true })
  @Property()
  auth?: Auth;
}

export const UserModel = getModel(User, "users");
