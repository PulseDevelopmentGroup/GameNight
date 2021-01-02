import "reflect-metadata";
import { prop as Property } from "@typegoose/typegoose";
import { Field, InterfaceType } from "type-graphql";
import { ObjectId } from "mongodb";
import { Ref } from "../../types";
import { Team } from "./team";
import { getModel } from "../helpers";

@InterfaceType()
export class Game {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  active: boolean;

  @Field((type) => Team, { nullable: true })
  @Property({ type: () => [Team] })
  winners?: Ref<Team>[];

  @Field((type) => Team, { nullable: true })
  @Property({ type: () => [Team] })
  teams?: Ref<Team>[];

  @Field()
  @Property({ required: true })
  dateStarted: Date;

  @Field({ nullable: true })
  @Property()
  dateEnded?: Date;
}

export const GameModel = getModel(Game, "games");
