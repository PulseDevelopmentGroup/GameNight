export interface Environment {
  debug: boolean;
  auth: boolean;

  httpAddr: string;
  httpPort: number;
  httpScrt: string;

  dbAddr: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPass: string;

  authGithubID: string;
  authGithubSecret: string;
  authGoogleID: string;
  authGoogleSecret: string;
  authDiscordID: string;
  authDiscordSecret: string;
}

export const getEnvironment = () => {
  return new Promise<Environment>((res, rej) => {
    let env: Environment = {
      debug: Boolean(process.env.GAMENIGHT_DEBUG) ?? false,
      auth: Boolean(process.env.GAMENIGHT_AUTH) ?? true,
      httpAddr: process.env.GAMENIGHT_HTTP_ADDR ?? "0.0.0.0",
      httpPort: Number(process.env.GAMENIGHT_HTTP_PORT) ?? 8080,
      httpScrt: process.env.GAMENIGHT_HTTP_SECRET ?? "",
      dbAddr: process.env.GAMENIGHT_DB_ADDR ?? "",
      dbPort: Number(process.env.GAMENIGHT_DB_PORT) ?? 27017,
      dbName: process.env.GAMENIGHT_DB_NAME ?? "gamenight",
      dbUser: process.env.GAMENIGHT_DB_USER ?? "admin",
      dbPass: process.env.GAMENIGHT_DB_PASS ?? "",
      authGithubID: process.env.GAMENIGHT_AUTH_GITHUB_CLIENT_ID ?? "",
      authGithubSecret: process.env.GAMENIGHT_AUTH_GITHUB_CLIENT_SECRET ?? "",
      authDiscordID: process.env.GAMENIGHT_AUTH_DISCORD_CLIENT_ID ?? "",
      authDiscordSecret: process.env.GAMENIGHT_AUTH_DISCORD_CLIENT_SECRET ?? "",
      authGoogleID: process.env.GAMENIGHT_AUTH_GOOGLE_CLIENT_ID ?? "",
      authGoogleSecret: process.env.GAMENIGHT_AUTH_GOOGLE_CLIENT_SECRET ?? "",
    };

    if (!env.httpScrt || !env.dbAddr || !env.dbPass) {
      return rej(
        new Error(
          "GAMENIGHT_HTTP_SECRET or GAMENIGHT_DB_ADDR or GAMENIGHT_DB_PASS not set"
        )
      );
    }

    if (env.debug) console.log(env);

    return res(env);
  });
};
