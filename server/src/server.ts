import dotenv from "dotenv";
dotenv.config();

import fastify from "fastify";
import { ApolloServer } from "apollo-server-fastify";
import { buildSchema } from "type-graphql";
import { GraphQLSchema } from "graphql";
import { connect } from "mongoose";
import { ObjectId } from "mongodb";
import path from "path";
import { URL } from "url";

import { ObjectIdScalar, URLScalar } from "./graphql/scalars";
import { RoomResolver } from "./graphql/resolvers/room";
import { UserResolver } from "./graphql/resolvers/user";
import { TypegooseMiddleware } from "./middleware";
import { getEnvironment, Environment } from "./config";

let env: Environment;
let schema: GraphQLSchema;

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
    validate: false,
  });
}

/**
 * Main function (Not that we need a whole comment to mention that)
 */
function main() {
  // Initialize server
  const app = fastify();
  app.register(
    // Register Apollo handler
    // NOTE: Must be on version 3 (alpha) to support current version of fastify
    new ApolloServer({
      introspection: env.debug,
      playground: env.debug,
      schema,
    }).createHandler()
  );

  app.get("/ping", async () => {
    return "pong";
  });

  app.listen(env.httpPort, env.httpAddr, (err, add) => {
    if (err) {
      console.error(`Unable to start server: "${err}"`);
      process.exit(1);
    }
    console.log(`Server listening at ${add}`);
  });
}
