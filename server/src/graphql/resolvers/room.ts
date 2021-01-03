import "reflect-metadata";
import { ObjectId } from "mongodb";
import { Resolver, Query, Arg, FieldResolver, Root } from "type-graphql";
import { ObjectIdScalar } from "../scalars";
import { Room, RoomModel } from "../entities/room";
import { User, UserModel } from "../entities/user";
import { Game, GameModel } from "../entities/game";

@Resolver((of) => Room)
export class RoomResolver {
  // Get room by ID
  @Query((returns) => Room, { nullable: true })
  room(@Arg("roomId", (type) => ObjectIdScalar) roomId: ObjectId) {
    return RoomModel.findById(roomId);
  }

  // Get room by code
  @Query((returns) => Room, { nullable: true })
  roomByCode(@Arg("roomCode", (type) => ObjectIdScalar) roomCode: string) {
    return RoomModel.findOne({ code: roomCode });
  }

  // Get all rooms
  @Query((returns) => [Room])
  async rooms(): Promise<Room[]> {
    return await RoomModel.find({});
  }

  // Get list of users associated with the room
  @FieldResolver()
  async members(@Root() room: Room): Promise<User[]> {
    let users: User[] = [];

    room.members.forEach(async (id) => {
      const user = await UserModel.findById(id);
      if (user) {
        users.push(user);
      }
    });

    return users;
  }

  // Get list of games associated with the room
  @FieldResolver()
  async gameHistory(@Root() room: Room): Promise<Game[]> {
    let games: Game[] = [];

    room.gameHistory?.forEach(async (id) => {
      const game = await GameModel.findById(id);
      if (game) {
        games.push(game);
      }
    });

    return games;
  }
}
