export interface Environment {
  debug: boolean;
  firstRun: boolean;
  httpAddr: string;
  httpPort: string;
  httpScrt: string;
  dbAddr: string;
  dbPort: string;
  dbName: string;
  dbUser: string;
  dbPass: string;
}
