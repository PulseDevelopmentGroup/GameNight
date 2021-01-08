import { AuthChecker } from "type-graphql";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStragety } from "passport-google-oauth20";
import { Strategy as DiscordStragety } from "passport-discord";
import { Express } from "express";
import session from "express-session";

import { UserModel } from "./graphql/entities/user";
import { User } from "./graphql/entities/user";
import { URL } from "url";
//import { MongoStore } from "connect-mongo";
import { Mongoose } from "mongoose";

interface AuthenticationOptions {
  server: Express;
  secret: string;
  url: URL;
  db: Mongoose;
  githubStragety?: OAuthOptions;
  googleStragety?: OAuthOptions;
  discordStragety?: OAuthOptions;
}

interface OAuthOptions {
  clientID: string;
  clientSecret: string;
  callbackURL?: string;
}

interface gqlAuthContext {
  user?: User;
}

export class Authentication {
  private options: AuthenticationOptions;
  sessionMiddleware: any; // Unfortunately, using any here is really the only option

  constructor(options: AuthenticationOptions) {
    this.options = options;
    this.sessionMiddleware = session({
      secret: this.options.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: this.options.url.protocol == "https:",
        maxAge: 24 * 60 * 60 * 1000,
        signed: true,
      },
      /* store: new MongoStore({}), */ // TODO: Setup mongo session storage
    });
  }

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
  private authOAuth(
    accessToken: string,
    refreshToken: string,
    profile: passport.Profile,
    done: any
  ) {
    // Look for user
    UserModel.findOne({ "auth.id": profile.id })
      .then((user) => {
        // If user is found, use that user for auth
        if (user) {
          user.updateOne({ lastLogin: new Date() }).exec();
          return done(null, user);
        }

        // If user is not found, create one
        UserModel.create({
          username: profile.username!, //TODO: saying this is never undefined is bad practice, but I'm open to suggestions
          nickname: profile.displayName,
          accountCreated: new Date(),
          lastLogin: new Date(),
          roles: ["USER"],
          auth: {
            provider: profile.provider,
            id: profile.id,
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        }).then((user) => {
          return done(null, user);
        });
      })
      .catch((e) => {
        return done(e, null);
      });
  }

  /**
   * Passport setup function specifying the login strageties to use
   * and creating the serializers and deserializers
   *
   * TODO: Support token refreshing (somehow) with: https://www.npmjs.com/package/passport-oauth2-refresh
   */
  setupPassport() {
    // Setup GitHub login
    if (this.options.githubStragety) {
      passport.use(
        new GitHubStrategy(
          {
            clientID: this.options.githubStragety.clientID,
            clientSecret: this.options.githubStragety.clientSecret,
            callbackURL:
              this.options.githubStragety.callbackURL ??
              this.options.url.toString() + "auth/external/github/callback",
            scope: ["read:user"],
          },
          this.authOAuth
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
            callbackURL:
              this.options.googleStragety.callbackURL ??
              this.options.url.toString() + "auth/external/google/callback",
            scope: ["read:user"],
          },
          this.authOAuth
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
            callbackURL:
              this.options.discordStragety.callbackURL ??
              this.options.url.toString() + "auth/external/discord/callback",
            scope: ["identify", "email"],
          },
          this.authOAuth
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
