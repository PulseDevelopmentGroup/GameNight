import "reflect-metadata";
import {
  Resolver,
  Query,
  FieldResolver,
  Root,
  Authorized,
  Mutation,
  Ctx,
  Args,
} from "type-graphql";
import { Room, RoomModel } from "../entities/room";
import { User, UserModel } from "../entities/user";
import { Game, GameModel } from "../entities/game";
import { RequestContext } from "../types";
import { RoomArgs, JoinRoomArgs } from "./room.inputs";

@Resolver((of) => Room)
export class RoomResolver {
  /* 
  
  === Query Resolvers === 
  
  */

  // Get room by ID or code
  @Authorized()
  @Query((returns) => Room, { nullable: true })
  getRoom(@Args() { id, code }: RoomArgs) {
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
  async getRooms(): Promise<Room[]> {
    return await RoomModel.find({});
  }

  /* 
  
  === Mutation Resolvers === 
  
  */

  @Authorized()
  @Mutation((returns) => Room)
  async createRoom(@Ctx() ctx: RequestContext): Promise<Room> {
    return new Promise<Room>(async (res, rej) => {
      if (!ctx.user) {
        return rej("No user found in context... Probably an auth problem?"); //TODO: Standardize and centralize errors
      }

      if (await ctx.user.getRoom())
        //TODO: Eventually, we may want to give the user a prompt to choose to leave the room or stay
        return rej(
          "You must leave your current room before creating a new one"
        );

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

  @Authorized()
  @Mutation((returns) => Room)
  async joinRoom(
    @Args() { code }: JoinRoomArgs,
    @Ctx() ctx: RequestContext
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
  async leaveRoom(@Ctx() ctx: RequestContext): Promise<Boolean> {
    return new Promise<Boolean>(async (res, rej) => {
      if (!ctx.user) {
        return rej("No user found in context... Probably an auth problem?"); //TODO: Standardize and centralize errors
      }

      const room = await ctx.user.leaveRoom();

      if (!room) {
        return rej("Unable to leave room. User has already left.");
      }

      //TODO: Something to inform the other users that somebody left
      return res(true);
    });
  }

  @Authorized(["ADMIN"])
  @Mutation((returns) => Boolean)
  async deleteRoom(
    @Args() { id, code }: RoomArgs,
    @Ctx() ctx: RequestContext
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

  /* 
  
  === Subscription Resolvers === 
  
  */

  /* 
  
  === Field Resolvers ===
  
  */

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
}
