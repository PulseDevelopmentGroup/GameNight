import { getModelForClass } from "@typegoose/typegoose";
import {
  AnyParamConstructor,
  ReturnModelType,
} from "@typegoose/typegoose/lib/types";
import * as mongoose from "mongoose";

/**
 * `getModel()` wraps `getModelForClass()` and specifies what mongoose instance to use along with any custom options
 */
export function getModel<U extends AnyParamConstructor<any>, QueryHelpers = {}>(
  cl: U,
  collection: string
): ReturnModelType<U, QueryHelpers> {
  return getModelForClass(cl, {
    existingMongoose: mongoose,
    schemaOptions: { collection: collection },
  });
}
