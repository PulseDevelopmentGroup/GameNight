import "reflect-metadata";
import { ModelOptions, prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { User } from "./user";
import { Ref } from "../types";
import { GameMeta } from "./gameMeta";

@ObjectType()
@ModelOptions({ schemaOptions: { _id: false } })
export class Vote {
  @Field((type) => User)
  @Property({ ref: User, required: true })
  user: Ref<User>;

  @Field((type) => GameMeta)
  @Property({ ref: GameMeta, required: true })
  game: Ref<GameMeta>;
}
