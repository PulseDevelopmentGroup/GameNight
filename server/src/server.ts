import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { GraphQLSchema } from "graphql";
import { connect } from "mongoose";
import { ObjectId } from "mongodb";
import passport from "passport";
import path from "path";
import { URL } from "url";
import Redis, { RedisOptions } from "ioredis";

import { ObjectIdScalar, URLScalar } from "./graphql/scalars";
import { RoomResolver } from "./graphql/resolvers/room";
import { UserResolver } from "./graphql/resolvers/user";
import { TypegooseMiddleware } from "./middleware";
import { getEnvironment, Environment } from "./config";
import { Authentication } from "./auth";
import { UserModel } from "./graphql/entities/user";
import { RedisPubSub } from "graphql-redis-subscriptions";

let env: Environment;
let schema: GraphQLSchema;
let auth: Authentication;
let server: Express;
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

  // Initialize webserver
  server = express();

  if (env.auth) {
    // Setup authentication
    auth = new Authentication({
      server,
      httpSecret: env.httpScrt,
      githubStragety: {
        clientID: env.authGithubID,
        clientSecret: env.authGithubSecret,
        callbackURL: "http://localhost:4001/auth/external/github/callback",
      },
      discordStragety: {
        clientID: env.authDiscordID,
        clientSecret: env.authDiscordSecret,
        callbackURL: "http://localhost:4001/auth/external/discord/callback",
      },
    });
  }

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

  // Configure Redis
  const redisOptions: RedisOptions = {
    host: env.redisAddr,
    port: env.redisPort,
    retryStrategy: (times) => Math.max(times * 100, 3000),
  };

  // Build schema and generate GraphQL schema file
  schema = await buildSchema({
    resolvers: [RoomResolver, UserResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    globalMiddlewares: [TypegooseMiddleware],
    dateScalarMode: "isoDate",
    scalarsMap: [
      { type: ObjectId, scalar: ObjectIdScalar },
      { type: URL, scalar: URLScalar },
    ],
    authChecker: env.auth ? auth.gqlAuthChecker : undefined,
    validate: false,
    pubSub: new RedisPubSub({
      publisher: new Redis(redisOptions),
      subscriber: new Redis(redisOptions),
    }),
  });

  // Initialize ApolloServer
  apolloServer = new ApolloServer({
    debug: env.debug,
    playground: {
      settings: {
        "request.credentials": "include", // Required to pass auth to graphql endpoint from playground
      },
    },
    schema,
    subscriptions: {
      path: "/subscriptions",
      onConnect: (_, ws: any) => {
        console.log(ws.upgradeReq);
        auth.sessionMiddleware(ws.upgradeReq, {} as any, () => {
          console.log(ws.upgradeReq.session);
        });
      },
    },
    // Ensure user is logged in before accessing GraphQL endpoint
    context: env.auth
      ? async ({ req }) => {
          if (req.user) {
            return {
              req,
              user: await UserModel.findById(req.user._id),
            };
          }

          throw new Error("You must be logged in");
        }
      : undefined,
  });
}

/**
 * Main function (Not that we need a whole comment to mention that)
 */
function main() {
  if (env.auth) {
    // Initialize Passport strageties
    auth.setupPassport();

    // Register auth middlewares
    auth.registerMiddlewares();

    server.get("/login", (_, res) => {
      res.send(`
        <a href="/auth/external/github">GitHub</a>
        <a href="/auth/external/discord">Discord</a>
      `);
    });

    server.get("/logout", (_, res) => {
      res.redirect("/auth/logout");
    });

    server.get(["/logout", "/auth/logout"], (req, res) => {
      req.logout();
      res.redirect("/");
    });

    server.get("/auth/external/discord", passport.authenticate("discord"));

    server.get(
      "/auth/external/discord/callback",
      passport.authenticate("discord", {
        failureRedirect: "/login",
      }),
      (_, res) => {
        res.redirect("/");
      }
    );

    server.get("/auth/external/github", passport.authenticate("github"));

    server.get(
      "/auth/external/github/callback",
      passport.authenticate("github", {
        failureRedirect: "/login",
      }),
      (_, res) => {
        res.redirect("/");
      }
    );
  }

  server.get("/", (req, res) => {
    if (req.user) {
      return res.send(JSON.stringify(req.user));
    }
    res.send("You don't appear to be logged in");
  });

  // Apply ApolloServer middleware
  apolloServer.applyMiddleware({ app: server });

  server.listen(env.httpPort, env.httpAddr, () => {
    console.log(`Server listening at ${env.httpAddr}:${env.httpPort}`);
  });
}
