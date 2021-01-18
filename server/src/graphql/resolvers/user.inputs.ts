import { ArgsType, Field } from "type-graphql";
import { ObjectId } from "mongodb";
import { ObjectIdScalar } from "../scalars";

@ArgsType()
export class UserArgs {
  @Field((type) => ObjectIdScalar, { nullable: true })
  id?: ObjectId; // Note: There is no validation performed here because GraphQL performs its own validation later on

  @Field({ nullable: true })
  username?: string;
}
