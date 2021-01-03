import "reflect-metadata";
import { prop as Property } from "@typegoose/typegoose";
import { Authorized, Field, ObjectType } from "type-graphql";

@ObjectType()
export class Auth {
  @Field({ nullable: true })
  @Property()
  githubId?: string;

  @Field({ nullable: true })
  @Property()
  githubAccessToken?: string;

  @Field({ nullable: true })
  @Property()
  githubRefreshToken?: string;
}
