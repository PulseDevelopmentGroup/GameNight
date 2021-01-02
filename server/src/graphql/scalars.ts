import { GraphQLScalarType, GraphQLError, Kind } from "graphql";
import { URL } from "url";
import * as mongoose from "mongoose";

export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo object id scalar type",
  serialize(value: unknown): string {
    // Check the type of received value
    if (!(value instanceof mongoose.Types.ObjectId)) {
      throw new Error("ObjectIdScalar can only serialize ObjectId values");
    }
    return (value as mongoose.Types.ObjectId).toHexString(); // value sent to the client
  },
  parseValue(value: unknown): mongoose.Types.ObjectId {
    // check the type of received value
    if (typeof value !== "string") {
      throw new Error("ObjectIdScalar can only parse string values");
    }
    return new mongoose.Types.ObjectId(value); // value from the client input variables
  },
  parseLiteral(ast): mongoose.Types.ObjectId {
    // check the type of received value
    if (ast.kind !== Kind.STRING) {
      throw new Error("ObjectIdScalar can only parse string values");
    }
    return new mongoose.Types.ObjectId(ast.value); // value from the client query
  },
});

export const URLScalar = new GraphQLScalarType({
  name: "URL",

  description:
    "A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt.",

  serialize(value) {
    if (value) {
      return new URL(value.toString()).toString();
    } else {
      return value;
    }
  },

  parseValue: (value) => (value ? new URL(value.toString()) : value),

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as URLs but got a: ${ast.kind}`
      );
    }

    if (ast.value) {
      return new URL(ast.value.toString());
    } else {
      return ast.value;
    }
  },
});
