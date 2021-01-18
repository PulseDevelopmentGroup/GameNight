import { Matches } from "class-validator";
import { ObjectId } from "mongodb";
import { ArgsType, Field } from "type-graphql";
import { ObjectIdScalar } from "../scalars";
import { codeRegex } from "../entities/room";

@ArgsType()
export class RoomArgs {
  @Field((type) => ObjectIdScalar, { nullable: true })
  id?: ObjectId; // Note: There is no validation performed here because GraphQL performs its own validation later on

  @Field({ nullable: true })
  @Matches(codeRegex)
  code?: string;
}

@ArgsType()
export class JoinRoomArgs {
  @Field()
  @Matches(codeRegex)
  code: string;
}
