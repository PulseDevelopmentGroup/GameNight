import "reflect-metadata";
import { ModelOptions, prop as Property } from "@typegoose/typegoose";
import { Authorized, Field, ObjectType } from "type-graphql";

@ObjectType()
@ModelOptions({ schemaOptions: { _id: false } })
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
