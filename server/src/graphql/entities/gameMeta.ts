import "reflect-metadata";
import { prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { ObjectId } from "mongodb";
import { getModel } from "../helpers";
import { URL } from "url";

@ObjectType()
export class GameMeta {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  name: string;

  @Field()
  @Property({ required: true })
  coverImage: URL;
}

export const GameMetaModel = getModel(GameMeta, "gameMeta");
