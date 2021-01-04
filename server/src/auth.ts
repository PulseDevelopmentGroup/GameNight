import { AuthChecker } from "type-graphql";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStragety } from "passport-google-oauth20";
import { Strategy as DiscordStragety } from "passport-discord";
import { Express } from "express";
import cookieSession from "cookie-session";

import { UserModel } from "./graphql/entities/user";
import { User } from "./graphql/entities/user";

interface AuthenticationOptions {
  server: Express;
  httpSecret: string;
  githubStragety?: OAuthOptions;
  googleStragety?: OAuthOptions;
  discordStragety?: OAuthOptions;
}

interface OAuthOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

interface gqlAuthContext {
  user?: User;
}

export class Authentication {
  private options: AuthenticationOptions;

  /**
   *
   * Authenticate GraphQL queries
   *
   */
  gqlAuthChecker: AuthChecker<gqlAuthContext> = (
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

  sessionMiddleware: any; // Unfortunately, using any here is really the only option

  constructor(options: AuthenticationOptions) {
    this.options = options;
    this.sessionMiddleware = cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      keys: [this.options.httpSecret],
    });
  }

  /**
   * Registers passport and cookie middlewares with Express
   */
  registerMiddlewares() {
    this.options.server.use(
      this.sessionMiddleware,
      passport.initialize(),
      passport.session()
    );
  }

  /**
   * Internal function for handling the checking and creation of users
   *
   * @param accessToken OAuth access token
   * @param refreshToken OAuth refresh token
   * @param profile User profile (comes from external provider)
   * @param done Callback function
   */
  private authUser(
    accessToken: string,
    refreshToken: string,
    profile: passport.Profile,
    done: any
  ) {
    // Look for user
    UserModel.findOne({ "auth.id": profile.id }, (err, user) => {
      if (err) {
        return done(err, null);
      }

      // If user is found, use that user for auth
      if (user) {
        return done(null, user);
      }

      // If user is not found, create a user
      UserModel.create({
        username: profile.username!, //TODO: saying this is never undefined is bad practice, but I'm open to suggestions
        nickname: profile.displayName,
        roles: ["USER"],
        auth: {
          provider: profile.provider,
          id: profile.id,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    })
      .catch((e) => {
        return done(e, null);
      })
      .then((user) => {
        return done(null, user);
      });
  }

  /**
   * Passport setup function specifying the login strageties to use
   * and creating the serializers and deserializers
   */
  setupPassport() {
    // Setup GitHub login
    if (this.options.githubStragety) {
      passport.use(
        new GitHubStrategy(
          {
            clientID: this.options.githubStragety.clientID,
            clientSecret: this.options.githubStragety.clientSecret,
            callbackURL: this.options.githubStragety.callbackURL,
            scope: ["read:user"],
          },
          this.authUser
        )
      );
    }

    // Setup Google login
    if (this.options.googleStragety) {
      passport.use(
        new GoogleStragety(
          {
            clientID: this.options.googleStragety.clientID,
            clientSecret: this.options.googleStragety.clientSecret,
            callbackURL: this.options.googleStragety.callbackURL,
          },
          this.authUser
        )
      );
    }

    // Setup Discord login
    if (this.options.discordStragety) {
      passport.use(
        new DiscordStragety(
          {
            clientID: this.options.discordStragety.clientID,
            clientSecret: this.options.discordStragety.clientSecret,
            callbackURL: this.options.discordStragety.callbackURL,
            scope: ["identify", "email"],
          },
          this.authUser
        )
      );
    }

    // Handle user serialization
    passport.serializeUser((user: Express.User, done) => {
      done(null, user._id);
    });

    // Handle user deserialization
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
}
