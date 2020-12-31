import fastify from "fastify";
import { ApolloServer } from "apollo-server-fastify";
import { getEnvironment } from "./config";
import { resolvers } from "./graphql/resolvers";
import { loadSchemaSync } from "@graphql-tools/load";
import { JsonFileLoader } from "@graphql-tools/json-file-loader";
import { Database } from "./db/mongo";
import path from "path";
import { Environment } from "./types";

let env: Environment;

async function init() {
  env = await getEnvironment();

  let db = new Database({
    user: env.dbUser,
    pass: env.dbPass,
    addr: env.dbAddr,
    port: env.dbPort,
    name: env.dbName,
  });
  db.connect();

  if (env.firstRun) {
    db.seed();
    //TODO: Some sort of thingy to make sure the seed only happens once
  }
}

init()
  .then(main)
  .catch((e) => {
    console.log(`There was an error starting the server "${e}"`);
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
      context: ({ req }) => {
        const token = req.headers.authorization || "";
      },
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
