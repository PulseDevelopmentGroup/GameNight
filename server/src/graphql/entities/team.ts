import "reflect-metadata";
import { prop as Property, Ref } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { ObjectId } from "mongodb";
import { getModel } from "../helpers";
import { User } from "./user";

@ObjectType()
export class Team {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property()
  name: string;

  @Field((type) => [User])
  @Property({ type: () => [User], required: true })
  members: Ref<User>[];
}

export const TeamModel = getModel(Team, "teams");
