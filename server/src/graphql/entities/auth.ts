import "reflect-metadata";
import { ModelOptions, prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

//TODO: This will likely not be included in the GraphQL schema in the future
@ObjectType()
@ModelOptions({ schemaOptions: { _id: false } })
export class Auth {
  @Field()
  @Property()
  provider: string;

  @Field()
  @Property()
  id: string;

  @Field()
  @Property()
  accessToken?: string;

  @Field()
  @Property()
  refreshToken?: string;
}
