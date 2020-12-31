import { MongoClient, Db } from "mongodb";
import { collections } from "./seed";
import {
  UserDbObject,
  RoomDbObject,
  GameMetaDbObject,
} from "../graphql/generated/resolver-types";

export interface DatabaseConfig {
  user: string;
  pass: string;
  addr: string;
  port: string | number;
  name: string;
}

export class Database {
  private config: DatabaseConfig;
  private client: MongoClient;
  private db!: Db;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.client = new MongoClient(
      `mongodb://${config.user}:${config.pass}@${config.addr}:${config.port}`
    );
  }

  connect(): Promise<void> {
    return new Promise<void>(async () => {
      await this.client.connect();

      this.db = this.client.db(this.config.name);
    });
  }

  disconnect(): Promise<void> {
    return this.client.close();
  }

  seed(): Promise<void> {
    return new Promise<void>(async () => {
      collections.forEach(async (col) => {
        const collection = await this.db?.createCollection(col.name);

        // Clear the collection, if we're seeding it, might as well start from a clean slate
        if (col.enteries) {
          await collection.deleteMany({});
        }

        col.enteries?.forEach(
          async (ent: UserDbObject | RoomDbObject | GameMetaDbObject) => {
            await collection.insertOne(ent); //TODO: If this fails, does the promise get automaticlly rejected?
          }
        );
      });
    });
  }
}
