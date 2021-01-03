import { AuthChecker } from "type-graphql";
import { User } from "./graphql/entities/user";

export interface AuthContext {
  user?: User;
}

export const userAuthChecker: AuthChecker<AuthContext> = (
  { context: { user } },
  roles
) => {
  // If `@Authorized()`, check only is user exist
  if (roles.length === 0) {
    return user !== undefined;
  }

  // If no user, deny access
  if (!user) {
    return false;
  }

  // Grant access if roles overlap
  if (user.roles.some((role) => roles.includes(role))) {
    return true;
  }

  // Otherwise, deny
  return false;
};
