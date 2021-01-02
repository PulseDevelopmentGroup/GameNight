import { getModelForClass } from "@typegoose/typegoose";
import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";
import * as mongoose from "mongoose";

/**
 * `getModel()` wraps `getModelForClass()` and specifies what mongoose instance to use along with any custom options
 */
export const getModel = (
  cl: AnyParamConstructor<any>,
  collection: string
): any => {
  return getModelForClass(cl, {
    existingMongoose: mongoose,
    schemaOptions: { collection: collection },
  });
};
