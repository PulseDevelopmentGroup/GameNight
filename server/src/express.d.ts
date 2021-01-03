import { ObjectId } from "mongodb";
import { User as UserEntity } from "./graphql/entities/user";

// On 1/2/2021, the first offical "hack" was implemented
// See: https://github.com/microsoft/TypeScript-Node-Starter/issues/221
// and: https://github.com/DefinitelyTyped/DefinitelyTyped/commit/91c229dbdb653dbf0da91992f525905893cbeb91#r34812715
declare global {
  namespace Express {
    interface User extends UserEntity {}
  }
}
