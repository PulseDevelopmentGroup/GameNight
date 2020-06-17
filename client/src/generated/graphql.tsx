import gql from "graphql-tag";
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  URL: any;
};

export type User = {
  id: Scalars["ID"];
  username: Scalars["String"];
  nickname?: Maybe<Scalars["String"]>;
  image?: Maybe<Scalars["URL"]>;
  jwt?: Maybe<Scalars["String"]>;
};

export type Room = {
  __typename?: "Room";
  id: Scalars["ID"];
  code: Scalars["String"];
  leader: User;
  users: Array<Maybe<User>>;
  currentGame: Game;
  gameVotes: Array<Maybe<GameVote>>;
  gameHistory?: Maybe<Array<Maybe<Game>>>;
  dateCreated: Scalars["Date"];
};

export type Game = {
  id: Scalars["ID"];
  isComplete: Scalars["Boolean"];
  winners?: Maybe<Array<Maybe<User>>>;
  dateStarted: Scalars["Date"];
  dateEnded?: Maybe<Scalars["Date"]>;
};

export type SypfallGame = Game & {
  __typename?: "SypfallGame";
  id: Scalars["ID"];
  isComplete: Scalars["Boolean"];
  winners?: Maybe<Array<Maybe<User>>>;
  dateStarted: Scalars["Date"];
  dateEnded?: Maybe<Scalars["Date"]>;
  players?: Maybe<Array<Maybe<SpyfallUser>>>;
  location: Scalars["String"];
};

export type SpyfallUser = User & {
  __typename?: "SpyfallUser";
  id: Scalars["ID"];
  username: Scalars["String"];
  nickname?: Maybe<Scalars["String"]>;
  image?: Maybe<Scalars["URL"]>;
  jwt?: Maybe<Scalars["String"]>;
  isSpy: Scalars["Boolean"];
  role: Scalars["String"];
};

export type GameMeta = {
  __typename?: "GameMeta";
  id: Scalars["ID"];
  name: Scalars["String"];
  coverImage?: Maybe<Scalars["URL"]>;
};

export type GameVote = {
  __typename?: "GameVote";
  user: User;
  game: GameMeta;
};

export type Query = {
  __typename?: "Query";
  user?: Maybe<User>;
  room?: Maybe<Room>;
  roomByCode?: Maybe<Room>;
  games: Array<Maybe<Game>>;
};

export type QueryUserArgs = {
  id: Scalars["String"];
};

export type QueryRoomArgs = {
  id: Scalars["String"];
};

export type QueryRoomByCodeArgs = {
  code: Scalars["String"];
};

export type MutationResponse = {
  code: Scalars["String"];
  success: Scalars["Boolean"];
  message: Scalars["String"];
};

export type CreateRoomInput = {
  username: Scalars["String"];
};

export type CreateRoomMutationResponse = MutationResponse & {
  __typename?: "CreateRoomMutationResponse";
  code: Scalars["String"];
  success: Scalars["Boolean"];
  message: Scalars["String"];
  room?: Maybe<Room>;
  user?: Maybe<User>;
};

export type JoinRoomInput = {
  username: Scalars["String"];
  roomCode: Scalars["String"];
};

export type JoinRoomMutationResponse = MutationResponse & {
  __typename?: "JoinRoomMutationResponse";
  code: Scalars["String"];
  success: Scalars["Boolean"];
  message: Scalars["String"];
  room?: Maybe<Room>;
  user?: Maybe<User>;
};

export type VoteForGameInput = {
  gameId: Scalars["ID"];
};

export type VoteForGameMutationResponse = MutationResponse & {
  __typename?: "VoteForGameMutationResponse";
  code: Scalars["String"];
  success: Scalars["Boolean"];
  message: Scalars["String"];
  vote?: Maybe<GameVote>;
};

export type Mutation = {
  __typename?: "Mutation";
  createRoom?: Maybe<CreateRoomMutationResponse>;
  joinRoom?: Maybe<JoinRoomMutationResponse>;
  voteForGame?: Maybe<VoteForGameMutationResponse>;
};

export type MutationCreateRoomArgs = {
  createInput?: Maybe<CreateRoomInput>;
};

export type MutationJoinRoomArgs = {
  joinInput?: Maybe<JoinRoomInput>;
};

export type MutationVoteForGameArgs = {
  voteInput?: Maybe<VoteForGameInput>;
};
