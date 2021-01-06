import "reflect-metadata";
import { prop as Property, ReturnModelType } from "@typegoose/typegoose";
import { Authorized, Field, ObjectType } from "type-graphql";
import { User } from "./user";
import { ObjectId } from "mongodb";
import { Ref } from "../types";
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
  @Property({ required: true })
  code: string;

  @Authorized()
  @Field((type) => [User])
  @Property({ ref: User, required: true })
  members: Ref<User>[];

  @Authorized()
  @Field((type) => [Vote], { nullable: true })
  @Property({ ref: Vote, default: [] })
  gameVotes?: Vote[];

  @Authorized()
  @Field((type) => Game, { nullable: true })
  @Property({ ref: Game })
  game?: Ref<Game>;

  @Authorized()
  @Field((type) => [Game], { nullable: true })
  @Property({ ref: Game })
  gameHistory?: Ref<Game>[];

  @Authorized()
  @Field()
  @Property({ default: new Date(), required: true })
  dateCreated: Date;

  public static async generateCode(
    this: ReturnModelType<typeof Room>,
    alphabet?: string,
    length?: number,
    customCode?: string
  ): Promise<string> {
    const len = length ?? 6;
    const alp = alphabet ?? "abcdefghijklmnopqrstuvwxyz";
    let code = customCode ?? "";

    if (!code) {
      for (let i = 0; i < len; i++) {
        code += alp.charAt(Math.floor(Math.random() * alp.length));
      }
    }

    // Woooo recursion
    if (await this.findOne({ code: code }).exec()) {
      console.log(`Code ${code}, exists. Regenerating.`);
      return this.generateCode(alp, len);
    }
    return code;
  }
}

export const RoomModel = getModel(Room, "rooms");
