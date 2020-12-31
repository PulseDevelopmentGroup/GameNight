import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
  URL: URL;
};



export type Query = {
  __typename?: 'Query';
  currentRoom?: Maybe<Scalars['String']>;
  games: Array<Maybe<GameMeta>>;
  room?: Maybe<Room>;
  roomByCode?: Maybe<Room>;
  user?: Maybe<User>;
};


export type QueryRoomArgs = {
  id: Scalars['ID'];
};


export type QueryRoomByCodeArgs = {
  code: Scalars['String'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login?: Maybe<LoginMutationResponse>;
  createRoom?: Maybe<CreateRoomMutationResponse>;
  joinRoom?: Maybe<JoinRoomMutationResponse>;
  voteForGame?: Maybe<VoteForGameMutationResponse>;
};


export type MutationLoginArgs = {
  loginInput?: Maybe<LoginInput>;
};


export type MutationJoinRoomArgs = {
  joinInput?: Maybe<JoinRoomInput>;
};


export type MutationVoteForGameArgs = {
  voteInput?: Maybe<VoteForGameInput>;
};

export type MutationResponse = {
  code: Scalars['String'];
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type LoginInput = {
  accessToken: Scalars['String'];
};

export type LoginMutationResponse = MutationResponse & {
  __typename?: 'LoginMutationResponse';
  code: Scalars['String'];
  success: Scalars['Boolean'];
  message: Scalars['String'];
  user?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  image?: Maybe<Scalars['URL']>;
  player?: Maybe<Player>;
  room?: Maybe<Room>;
  token?: Maybe<Scalars['String']>;
};

export type Player = {
  id: Scalars['ID'];
  user: User;
};

export type Room = {
  __typename?: 'Room';
  id: Scalars['ID'];
  code: Scalars['String'];
  leader: User;
  users: Array<Maybe<User>>;
  currentGame?: Maybe<Game>;
  gameVotes: Array<Maybe<GameVote>>;
  gameHistory?: Maybe<Array<Maybe<Game>>>;
  dateCreated: Scalars['Date'];
};

export type CreateRoomMutationResponse = MutationResponse & {
  __typename?: 'CreateRoomMutationResponse';
  code: Scalars['String'];
  success: Scalars['Boolean'];
  message: Scalars['String'];
  room?: Maybe<Room>;
  user?: Maybe<User>;
};

export type JoinRoomInput = {
  roomCode: Scalars['String'];
};

export type JoinRoomMutationResponse = MutationResponse & {
  __typename?: 'JoinRoomMutationResponse';
  code: Scalars['String'];
  success: Scalars['Boolean'];
  message: Scalars['String'];
  room?: Maybe<Room>;
  user?: Maybe<User>;
};

export type GameVote = {
  __typename?: 'GameVote';
  user: User;
  game: GameMeta;
};

export type VoteForGameInput = {
  gameId: Scalars['ID'];
};

export type VoteForGameMutationResponse = MutationResponse & {
  __typename?: 'VoteForGameMutationResponse';
  code: Scalars['String'];
  success: Scalars['Boolean'];
  message: Scalars['String'];
  vote?: Maybe<GameVote>;
};

export type Game = {
  id: Scalars['ID'];
  active: Scalars['Boolean'];
  winners?: Maybe<Array<Maybe<User>>>;
  dateStarted: Scalars['Date'];
  dateEnded?: Maybe<Scalars['Date']>;
};

export type GameMeta = {
  __typename?: 'GameMeta';
  id: Scalars['ID'];
  name: Scalars['String'];
  coverImage?: Maybe<Scalars['URL']>;
};
