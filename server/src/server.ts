import fastify from "fastify";
import { ApolloServer } from "apollo-server-fastify";
import { getEnvironment, Environment } from "./config";
import { resolvers } from "./graphql/resolvers";
import { loadSchemaSync } from "@graphql-tools/load";
import { JsonFileLoader } from "@graphql-tools/json-file-loader";
import { Database } from "./db/database";
import { Authentication } from "./auth";
import path from "path";

let env: Environment;
let auth: Authentication;

async function init() {
  env = await getEnvironment();

  const db = new Database({
    user: env.dbUser,
    pass: env.dbPass,
    addr: env.dbAddr,
    port: env.dbPort,
    name: env.dbName,
  });
  db.connect();

  auth = new Authentication({
    secret: env.httpScrt,
    expiration: "1y",
    db: db,
  });

  if (env.firstRun || env.isSeeded!) {
    db.seed();
    process.env.GAMENIGHT_IS_SEEDED = "true";
  }
}

init()
  .then(main)
  .catch((e) => {
    console.log(`There was an error initializing the server "${e}"`);
    process.exit(1);
  });

function main() {
  const schema = loadSchemaSync(
    path.join(__dirname, "../graphql.schema.json"),
    { loaders: [new JsonFileLoader()] }
  );

  const app = fastify();
  app.register(
    new ApolloServer({
      introspection: env.debug,
      playground: env.debug,
      schema,
      resolvers,
      context: auth.apollo,
    }).createHandler()
  );

  app.get("/ping", async () => {
    return "pong";
  });

  app.listen(env.httpPort, env.httpAddr, (err, add) => {
    if (err) {
      console.error(`Unable to start webserver: "${err}"`);
      process.exit(1);
    }
    console.log(`Server listening at ${add}`);
  });
}
