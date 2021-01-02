import "reflect-metadata";
import { Field, InterfaceType, ObjectType } from "type-graphql";
import { Room } from "./room";
import { User } from "./user";
import { Vote } from "./vote";

@InterfaceType()
export class MutationResponse {
  @Field()
  code: string;

  @Field()
  success: boolean;

  @Field()
  message: string;
}

@ObjectType({ implements: MutationResponse })
export class LoginMutationResponse {
  code: string;
  success: boolean;
  message: string;

  @Field((type) => User, { nullable: true })
  user?: User;
}

@ObjectType({ implements: MutationResponse })
export class CreateRoomMutationResponse {
  code: string;
  success: boolean;
  message: string;

  @Field((type) => Room, { nullable: true })
  room?: Room;
}

@ObjectType({ implements: MutationResponse })
export class JoinRoomMutationResponse {
  code: string;
  success: boolean;
  message: string;

  @Field((type) => Room, { nullable: true })
  room?: Room;
}

@ObjectType({ implements: MutationResponse })
export class VoteMutationResponse {
  code: string;
  success: boolean;
  message: string;

  @Field((type) => Vote, { nullable: true })
  vote?: Vote;
}
