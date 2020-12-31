//TODO: Eventually, seed data should probably maybe be moved to a json file
import { CollectionCreateOptions, ObjectID } from "mongodb";
import {
  UserDbObject,
  RoomDbObject,
  GameMetaDbObject,
} from "../graphql/generated/resolver-types";

export interface SeedCollection {
  name: string;
  options?: CollectionCreateOptions;
  enteries?: UserDbObject[] | RoomDbObject[] | GameMetaDbObject[];
}

export const collections: SeedCollection[] = [
  {
    name: "users",
  },
  {
    name: "rooms",
  },
  {
    name: "games",
  },
  {
    name: "gameMeta",
    enteries: [
      {
        name: "Spyfall",
      },
      {
        name: "Codenames",
      },
    ] as GameMetaDbObject[],
  },
];
