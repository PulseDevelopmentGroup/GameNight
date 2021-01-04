import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { GraphQLSchema } from "graphql";
import { connect } from "mongoose";
import { ObjectId } from "mongodb";
import passport from "passport";
import path from "path";
import { URL } from "url";
import cookieSession from "cookie-session";

import { ObjectIdScalar, URLScalar } from "./graphql/scalars";
import { RoomResolver } from "./graphql/resolvers/room";
import { UserResolver } from "./graphql/resolvers/user";
import { TypegooseMiddleware } from "./middleware";
import { getEnvironment, Environment } from "./config";
import { setupAuth, gqlAuthChecker } from "./auth";
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
  await connect(`mongodb://${env.dbAddr}:${env.dbPort}`, {
    auth: {
      user: env.dbUser,
      password: env.dbPass,
    },
    dbName: env.dbName,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    serverSelectionTimeoutMS: env.debug ? 10000 : undefined,
    socketTimeoutMS: env.debug ? 10000 : undefined,
  });

  // Build schema and generate GraphQL schema file
  schema = await buildSchema({
    resolvers: [RoomResolver, UserResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    globalMiddlewares: [TypegooseMiddleware],
    scalarsMap: [
      { type: ObjectId, scalar: ObjectIdScalar },
      { type: URL, scalar: URLScalar },
    ],
    authChecker: gqlAuthChecker,
    validate: false,
  });

  // Initialize ApolloServer
  apolloServer = new ApolloServer({
    playground: {
      settings: {
        "request.credentials": "include",
      },
    },
    schema,
    context: async ({ req }) => {
      if (req.user) {
        return {
          req,
          user: await UserModel.findById(req.user._id),
        };
      }

      throw new Error("You must be logged in");
    },
  });
}

/**
 * Main function (Not that we need a whole comment to mention that)
 */
function main() {
  // Initialize server and register Apollo handler
  const app = express();

  // Setup passport authentication
  setupAuth({
    githubStragety: {
      clientID: env.authGithubID,
      clientSecret: env.authGithubSecret,
      callbackURL: "http://localhost:4001/auth/github/callback",
    },
  });

  // Apply middlewares
  app.use(
    cookieSession({
      maxAge: 24 * 60 * 60 * 1000,
      keys: [env.httpScrt],
    }),
    passport.initialize(),
    passport.session()
  );

  // Apply ApolloServer middleware
  apolloServer.applyMiddleware({ app });

  app.get("/", async (req, res) => {
    if (req.user) {
      return res.send(JSON.stringify(req.user));
    }
    res.send("You don't appear to be logged in");
  });

  app.get("/login", (req, res) => {
    res.redirect("/auth/github");
  });

  app.get("/logout", (req, res) => {
    res.redirect("/auth/logout");
  });

  app.get("/auth/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get(
    "/auth/github",
    passport.authenticate("github", {
      scope: ["read:user"],
      failureRedirect: "/login",
    })
  );

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", {
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );

  app.listen(env.httpPort, env.httpAddr, () => {
    console.log(`Server listening at ${env.httpAddr}:${env.httpPort}`);
  });
}
