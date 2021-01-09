import "reflect-metadata";
import { ObjectId } from "mongodb";
import {
  Resolver,
  Query,
  Arg,
  FieldResolver,
  Root,
  Authorized,
  Mutation,
  Ctx,
} from "type-graphql";
import { ObjectIdScalar } from "../scalars";
import { Room, RoomModel } from "../entities/room";
import { User, UserModel } from "../entities/user";
import { Game, GameModel } from "../entities/game";
import { Context } from "../types";

@Resolver((of) => Room)
export class RoomResolver {
  /* === Query Resolvers === */

  // Get room by ID or code
  @Authorized()
  @Query((returns) => Room, { nullable: true })
  room(
    @Arg("id", (type) => ObjectIdScalar, { nullable: true }) id: ObjectId,
    @Arg("code", { nullable: true }) code: string
  ) {
    if (id) {
      return RoomModel.findById(id);
    }
    if (code) {
      return RoomModel.findOne({ code: code });
    }
  }

  // Get all rooms
  @Authorized(["ADMIN"])
  @Query((returns) => [Room])
  async rooms(): Promise<Room[]> {
    return await RoomModel.find({});
  }

  // Get list of users associated with the room
  @Authorized()
  @FieldResolver()
  async members(@Root() room: Room): Promise<User[]> {
    let users: User[] = [];

    for (const m of room.members) {
      const user = await UserModel.findById(m);
      if (user) {
        users.push(user);
      }
    }

    return users;
  }

  // Get a room's game history
  @Authorized()
  @FieldResolver()
  async gameHistory(@Root() room: Room): Promise<Game[]> {
    let games: Game[] = [];

    if (room.gameHistory) {
      for (const g of room.gameHistory) {
        const game = await GameModel.findById(g);
        if (game) {
          games.push(game);
        }
      }
    }

    return games;
  }

  /* === Mutation Resolvers === */
  @Authorized()
  @Mutation((returns) => Room)
  async createRoom(@Ctx() ctx: Context): Promise<Room> {
    return new Promise<Room>(async (res, rej) => {
      if (!ctx.user) {
        return rej("No user found in context... Probably an auth problem?"); //TODO: Standardize and centralize errors
      }

      const code = await RoomModel.generateCode();
      // TODO: Will have to check if user is in another room and remove them from that room first
      return res(
        await RoomModel.create({
          code: code,
          members: [ctx.user],
          dateCreated: new Date(),
        })
      );
    });
  }

  @Authorized()
  @Mutation((returns) => Room)
  async joinRoom(
    @Arg("code") code: string,
    @Ctx() ctx: Context
  ): Promise<Room> {
    return new Promise<Room>(async (res, rej) => {
      if (!ctx.user) {
        return rej("No user found in context... Probably an auth problem?"); //TODO: Standardize and centralize errors
      }

      const room = await RoomModel.findOneAndUpdate(
        { code: code },
        { $addToSet: { members: ctx.user } },
        { new: true }
      );
      if (room) {
        return res(room);
      }

      return rej(`No room found with code: ${code}`);
    });
  }

  @Authorized()
  @Mutation((returns) => Boolean)
  async leaveRoom(@Ctx() ctx: Context): Promise<Boolean> {
    return new Promise<Boolean>(async (res, rej) => {
      if (!ctx.user) {
        return rej("No user found in context... Probably an auth problem?"); //TODO: Standardize and centralize errors
      }

      const room = await RoomModel.findOneAndUpdate(
        { $in: { members: ctx.user } },
        { $pull: { members: ctx.user._id } },
        { new: true }
      );

      if (!room) {
        return rej("Unable find and/or update room");
      }

      //TODO: Something to inform the other users that somebody left
      return res(true);
    });
  }

  @Authorized(["ADMIN"])
  @Mutation((returns) => Boolean)
  async delRoom(
    @Arg("id", (type) => ObjectIdScalar, { nullable: true }) id: ObjectId,
    @Arg("code", { nullable: true }) code: string,
    @Ctx() ctx: Context
  ): Promise<Boolean> {
    return new Promise<Boolean>((res, rej) => {
      if (!ctx.user) {
        return rej("No user found in context... Probably an auth problem?"); //TODO: Standardize and centralize errors
      }

      if (id) {
        RoomModel.deleteOne(id)
          .exec()
          .then(() => {
            return res(true);
          });
      }

      if (code) {
        RoomModel.deleteOne({ code: code })
          .exec()
          .then(() => {
            return res(true);
          });
      }

      RoomModel.deleteOne({ $in: { members: ctx.user } })
        .exec()
        .then(() => {
          return res(true);
        })
        .catch((e) => {
          return rej(`Unable to remove room: ${e}`);
        });
    });
  }

  /* === Helper Functions (Not Resolvers) === */

  //TODO:
}
