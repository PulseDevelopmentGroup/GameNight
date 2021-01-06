import { User } from "./entities/user";
import { ObjectId } from "mongodb";

export type Ref<T> = T | ObjectId;
export interface Context {
  user?: User;
}
