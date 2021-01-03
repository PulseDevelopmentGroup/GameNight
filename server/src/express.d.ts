import { User as UserEntity } from "./graphql/entities/user";

// On 1/2/2021, the first offical "hack" was implemented
// See: https://github.com/microsoft/TypeScript-Node-Starter/issues/221
declare global {
  namespace Express {
    interface User extends UserEntity {}
  }
}
