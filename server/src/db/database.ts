import { MongoClient, Db, UpdateWriteOpResult, ObjectID } from "mongodb";
import {
  UserDbObject,
  RoomDbObject,
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
      `mongodb://${config.user}:${config.pass}@${config.addr}:${config.port}`,
      { useUnifiedTopology: true }
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

  set(
    collection: string,
    object: UserDbObject | RoomDbObject,
    upsert?: boolean
  ): Promise<UpdateWriteOpResult> {
    return this.db
      .collection(collection)
      .updateOne({ _id: object._id }, object, {
        upsert: upsert ?? true,
      });
  }

  get(collection: string, search: ObjectID): Promise<void | null> {
    return this.db.collection(collection).findOne({ _id: search });
  }

  seed(): Promise<void> {
    // TODO: As it stands now, seeding isn't entirely necessary,
    // but I'll leave this function as a reminder that we might
    // need to seed the DB in the future.

    return new Promise<void>(() => {});

    /*return new Promise<void>(async () => {
      collections.forEach(async (col) => {
        const collection = await this.db?.createCollection(col.name);

        // Clear the collection, if we're seeding it, might as well start from a clean slate
        if (col.enteries) {
          await collection.deleteMany({});
        }

        col.enteries?.forEach(
          async (ent: UserDbObject | RoomDbObject | GameMetaDbObject) => {
            await collection.insertOne(ent);
          }
        );
      });
    });*/
  }
}
