import "reflect-metadata";
import { Resolver, Query, Arg, Authorized, Args } from "type-graphql";
import { User, UserModel } from "../entities/user";
import { UserArgs } from "./user.inputs";

@Resolver((of) => User)
export class UserResolver {
  /* 
  
  === Query Resolvers === 
  
  */

  // Get all users
  @Authorized(["ADMIN"])
  @Query((returns) => [User])
  async users(): Promise<User[]> {
    return await UserModel.find({});
  }

  // Get user by ID or username
  @Query((returns) => User, { nullable: true })
  user(@Args() { id, username }: UserArgs) {
    if (id) {
      return UserModel.findById(id);
    }
    if (username) {
      return UserModel.findOne({ username: username });
    }
  }
}
