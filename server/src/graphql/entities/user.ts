import "reflect-metadata";
import { prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { ObjectId } from "mongodb";
import { getModel } from "../helpers";
import { URL } from "url";

@ObjectType()
export class User {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  username: string;

  @Field({ nullable: true })
  @Property()
  nickname?: string;

  @Field({ nullable: true })
  @Property()
  image?: URL;

  @Field()
  @Property({ required: true })
  token: string;

  @Property({ required: true, default: false })
  admin: boolean;
}

export const UserModel = getModel(User, "users");
