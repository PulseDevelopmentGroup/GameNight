export interface Environment {
  debug: boolean;
  firstRun: boolean;
  isSeeded: boolean;
  httpAddr: string;
  httpPort: string;
  httpScrt: string;
  dbAddr: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbPass: string;
}

export const getEnvironment = () => {
  return new Promise<Environment>((resolve, reject) => {
    let env: Environment = {
      debug: Boolean(process.env.GAMENIGHT_DEBUG) ?? false,
      firstRun: Boolean(process.env.GAMENIGHT_FIRSTRUN) ?? false,
      isSeeded: Boolean(process.env.GAMENIGHT_IS_SEEDED) ?? false,
      httpAddr: process.env.GAMENIGHT_HTTP_ADDR ?? "0.0.0.0",
      httpPort: process.env.GAMENIGHT_HTTP_PORT ?? "8080",
      httpScrt: process.env.GAMENIGHT_HTTP_SECRET ?? "",
      dbAddr: process.env.GAMENIGHT_DB_ADDR ?? "",
      dbPort: process.env.GAMENIGHT_DB_PORT ?? "27017",
      dbName: process.env.GAMENIGHT_DB_NAME ?? "gamenight",
      dbUser: process.env.GAMENIGHT_DB_USER ?? "admin",
      dbPass: process.env.GAMENIGHT_DB_PASS ?? "",
    };

    if (!env.httpScrt || !env.dbAddr || !env.dbPass) {
      return reject(
        new Error(
          "GAMENIGHT_HTTP_SECRET or GAMENIGHT_DB_ADDR or GAMENIGHT_DB_PASS not set"
        )
      );
    }

    if (env.debug) console.log(env);

    return resolve(env);
  });
};
