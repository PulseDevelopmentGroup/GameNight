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

  // Get list of games associated with the room
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
  @Mutation((returns) => Room)
  async createRoom(@Ctx() ctx: Context): Promise<Room> {
    return new Promise<Room>(async (res, rej) => {
      if (!ctx.user) {
        return rej("No user found in context... Probably an auth problem?"); //TODO: Standardize and centralize errors
      }

      const code = await RoomModel.generateCode();
      return res(
        await RoomModel.create({
          code: code,
          members: [ctx.user],
          dateCreated: new Date(),
        })
      );
    });
  }

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
}
