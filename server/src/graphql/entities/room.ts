import "reflect-metadata";
import { prop as Property } from "@typegoose/typegoose";
import { Authorized, Field, ObjectType } from "type-graphql";
import { User } from "./user";
import { ObjectId } from "mongodb";
import { Ref } from "../../types";
import { Game } from "./game";
import { Vote } from "./vote";
import { getModel } from "../helpers";

@ObjectType()
export class Room {
  @Authorized(["ADMIN"])
  @Field()
  readonly _id: ObjectId;

  @Authorized()
  @Field()
  @Property({ index: true, unique: true, required: true })
  code: string;

  @Authorized()
  @Field((type) => [User])
  @Property({ type: () => [User], required: true })
  members: Ref<User>[];

  @Authorized()
  @Field((type) => [Vote], { nullable: true })
  @Property({ type: () => Vote, default: [] })
  gameVotes?: Vote[];

  @Authorized()
  @Field((type) => Game, { nullable: true })
  @Property({ ref: Game })
  game?: Ref<Game>;

  @Authorized()
  @Field((type) => [Game], { nullable: true })
  @Property({ type: () => Game })
  gameHistory?: Ref<Game>[];

  @Authorized()
  @Field()
  @Property({ required: true })
  dateCreated: Date;
}

export const RoomModel = getModel(Room, "rooms");
