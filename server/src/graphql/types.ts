import { User } from "./entities/user";
import { ObjectId } from "mongodb";
import { Request } from "express";

export type Ref<T> = T | ObjectId;

// Context is pulled from the return of the ApolloServer context function
// TODO: Confirm the above. It would make the most sense to come from there
//       but I'm really not sure.
export interface RequestContext {
  req?: Request;
  user?: User;
}
