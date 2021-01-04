import { AuthChecker } from "type-graphql";
import { User } from "./graphql/entities/user";
import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import { UserModel } from "./graphql/entities/user";

/* === Type-GraphQL Authentication === */

interface gqlAuthContext {
  user?: User;
}

export const gqlAuthChecker: AuthChecker<gqlAuthContext> = (
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

/* === GraphQL Authentication === */

// TODO: Move stuff here

/* Passport Authentication */

export interface AuthenticationOptions {
  githubStragety?: StragetyOptions;
  googleStragety?: StragetyOptions;
  discordStragety?: StragetyOptions;
}

export interface StragetyOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

export function setupAuth(options: AuthenticationOptions) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: options.githubStragety!.clientID,
        clientSecret: options.githubStragety!.clientSecret,
        callbackURL: options.githubStragety!.callbackURL,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: GitHubProfile,
        done: any
      ) => {
        UserModel.findOne(
          { "authentication.githubId": profile.id },
          (err, user) => {
            if (user) {
              return done(err, user);
            }

            UserModel.create({
              username: profile.username!, //TODO: saying this is never undefined is bad practice, but I'm open to suggestions
              nickname: profile.displayName.split(" ")[0],
              roles: ["USER"],
              authentication: {
                githubId: profile.id,
                githubAccessToken: accessToken,
                githubRefreshToken: refreshToken,
              },
            })
              .catch((e) => {
                return done(e, null);
              })
              .then((user) => {
                return done(null, user);
              });
          }
        );
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id: string, done) => {
    UserModel.findById(id)
      .then((user) => {
        done(null, user as User);
      })
      .catch((e) => {
        done(e);
      });
  });
}
