import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { GraphQLSchema } from "graphql";
import { connect } from "mongoose";
import { ObjectId } from "mongodb";
import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import path from "path";
import { URL } from "url";

import { ObjectIdScalar, URLScalar } from "./graphql/scalars";
import { RoomResolver } from "./graphql/resolvers/room";
import { UserResolver } from "./graphql/resolvers/user";
import { TypegooseMiddleware } from "./middleware";
import { getEnvironment, Environment } from "./config";
import { userAuthChecker } from "./auth";
import { UserModel } from "./graphql/entities/user";

let env: Environment;
let schema: GraphQLSchema;
let apolloServer: ApolloServer;

init()
  .then(main)
  .catch((e) => {
    console.log(`There was an error initializing the server "${e}"`);
    process.exit(1);
  });

/**
 * Server initialization function
 * Initializes the server config, database, and authentication mechanisms
 */
async function init() {
  // Load enviornment variables
  env = await getEnvironment();

  // Connect to database
  await connect(
    `mongodb://${env.dbUser}:${env.dbPass}@${env.dbAddr}:${env.dbPort}`,
    {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      serverSelectionTimeoutMS: env.debug ? 10000 : undefined,
      socketTimeoutMS: env.debug ? 10000 : undefined,
    }
  );

  // Build schema and generate GraphQL schema file
  schema = await buildSchema({
    resolvers: [RoomResolver, UserResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    globalMiddlewares: [TypegooseMiddleware],
    scalarsMap: [
      { type: ObjectId, scalar: ObjectIdScalar },
      { type: URL, scalar: URLScalar },
    ],
    authChecker: userAuthChecker,
    validate: false,
  });

  passport.use(
    new GitHubStrategy(
      {
        clientID: env.authGithubID,
        clientSecret: env.authGithubSecret,
        callbackURL: "http://localhost:4001/auth/github/callback", //TODO: This will have to update dynamiclly
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: GitHubProfile,
        done: any
      ) => {
        UserModel.findOne(
          { "authentication.githubId": profile.id },
          (err, doc) => {
            if (doc) {
              return done(err, doc);
            }

            UserModel.create({
              username: profile.displayName,
              roles: ["USER"],
              authentication: {
                githubId: profile.id,
                githubAccessToken: accessToken,
                githubRefreshToken: refreshToken,
              },
            })
              .catch((e) => {
                done(e, null);
              })
              .then((doc) => {
                done(null, doc);
              });
          }
        );
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id); //TODO: This errors out saying _id does not exist... why?
  });

  passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
  });

  // Initialize ApolloServer
  apolloServer = new ApolloServer({
    introspection: env.debug,
    playground: env.debug,
    schema,
    context: (req) => {},
  });
}

/**
 * Main function (Not that we need a whole comment to mention that)
 */
function main() {
  // Initialize server and register Apollo handler
  const app = express();
  apolloServer.applyMiddleware({ app });

  app.use(passport.initialize(), passport.session());

  app.get("/ping", (req, res) => {
    res.send("Pong");
  });

  app.get("/auth/login", (req, res) => {
    res.redirect("/auth/github");
  });

  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  });

  app.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["read:user"] })
  );

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    (req, res) => {
      res.send(req.user);
      res.send("You reached the redirect URI");
    }
  );

  app.listen(env.httpPort, env.httpAddr, () => {
    console.log(`Server listening at ${env.httpAddr}:${env.httpPort}`);
  });
}
