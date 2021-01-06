import "reflect-metadata";
import { ObjectId } from "mongodb";
import { Resolver, Query, Arg, Authorized } from "type-graphql";
import { User, UserModel } from "../entities/user";
import { ObjectIdScalar } from "../scalars";

@Resolver((of) => User)
export class UserResolver {
  // Get user by ID
  @Query((returns) => User, { nullable: true })
  user(
    @Arg("id", (type) => ObjectIdScalar, { nullable: true }) id: ObjectId,
    @Arg("username", { nullable: true }) username: string
  ) {
    if (id) {
      return UserModel.findById(id);
    }
    if (username) {
      return UserModel.findOne({ username: username });
    }
  }

  // Get all users
  @Authorized(["ADMIN"])
  @Query((returns) => [User])
  async users(): Promise<User[]> {
    return await UserModel.find({});
  }
}
