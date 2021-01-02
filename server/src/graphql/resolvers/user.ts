import "reflect-metadata";
import { ObjectId } from "mongodb";
import { Resolver, Query, Arg } from "type-graphql";
import { User, UserModel } from "../entities/user";
import { ObjectIdScalar } from "../scalars";

@Resolver((of) => User)
export class UserResolver {
  // Get user by ID
  @Query((returns) => User, { nullable: true })
  user(@Arg("userId", (type) => ObjectIdScalar) userId: ObjectId) {
    return UserModel.findById(userId);
  }

  // Get all users
  @Query((returns) => [User])
  async users(): Promise<User[]> {
    return await UserModel.find({});
  }
}
