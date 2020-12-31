import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { UserModel, RoomModel } from '../models';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: ObjectID;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: Date;
  URL: URL;
};











export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  room?: Maybe<Room>;
  roomByCode?: Maybe<Room>;
  games: Array<Maybe<GameMeta>>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryRoomArgs = {
  id: Scalars['ID'];
};


export type QueryRoomByCodeArgs = {
  code: Scalars['String'];
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

export type AdditionalEntityFields = {
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Date: ResolverTypeWrapper<Scalars['Date']>;
  URL: ResolverTypeWrapper<Scalars['URL']>;
  Query: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Mutation: ResolverTypeWrapper<{}>;
  MutationResponse: ResolversTypes['LoginMutationResponse'] | ResolversTypes['CreateRoomMutationResponse'] | ResolversTypes['JoinRoomMutationResponse'] | ResolversTypes['VoteForGameMutationResponse'];
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  LoginInput: LoginInput;
  LoginMutationResponse: ResolverTypeWrapper<Omit<LoginMutationResponse, 'user'> & { user?: Maybe<ResolversTypes['User']> }>;
  User: ResolverTypeWrapper<UserModel>;
  Player: never;
  Room: ResolverTypeWrapper<RoomModel>;
  CreateRoomMutationResponse: ResolverTypeWrapper<Omit<CreateRoomMutationResponse, 'room' | 'user'> & { room?: Maybe<ResolversTypes['Room']>, user?: Maybe<ResolversTypes['User']> }>;
  JoinRoomInput: JoinRoomInput;
  JoinRoomMutationResponse: ResolverTypeWrapper<Omit<JoinRoomMutationResponse, 'room' | 'user'> & { room?: Maybe<ResolversTypes['Room']>, user?: Maybe<ResolversTypes['User']> }>;
  GameVote: ResolverTypeWrapper<Omit<GameVote, 'user'> & { user: ResolversTypes['User'] }>;
  VoteForGameInput: VoteForGameInput;
  VoteForGameMutationResponse: ResolverTypeWrapper<Omit<VoteForGameMutationResponse, 'vote'> & { vote?: Maybe<ResolversTypes['GameVote']> }>;
  Game: never;
  GameMeta: ResolverTypeWrapper<GameMeta>;
  AdditionalEntityFields: AdditionalEntityFields;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Date: Scalars['Date'];
  URL: Scalars['URL'];
  Query: {};
  ID: Scalars['ID'];
  String: Scalars['String'];
  Mutation: {};
  MutationResponse: ResolversParentTypes['LoginMutationResponse'] | ResolversParentTypes['CreateRoomMutationResponse'] | ResolversParentTypes['JoinRoomMutationResponse'] | ResolversParentTypes['VoteForGameMutationResponse'];
  Boolean: Scalars['Boolean'];
  LoginInput: LoginInput;
  LoginMutationResponse: Omit<LoginMutationResponse, 'user'> & { user?: Maybe<ResolversParentTypes['User']> };
  User: UserModel;
  Player: never;
  Room: RoomModel;
  CreateRoomMutationResponse: Omit<CreateRoomMutationResponse, 'room' | 'user'> & { room?: Maybe<ResolversParentTypes['Room']>, user?: Maybe<ResolversParentTypes['User']> };
  JoinRoomInput: JoinRoomInput;
  JoinRoomMutationResponse: Omit<JoinRoomMutationResponse, 'room' | 'user'> & { room?: Maybe<ResolversParentTypes['Room']>, user?: Maybe<ResolversParentTypes['User']> };
  GameVote: Omit<GameVote, 'user'> & { user: ResolversParentTypes['User'] };
  VoteForGameInput: VoteForGameInput;
  VoteForGameMutationResponse: Omit<VoteForGameMutationResponse, 'vote'> & { vote?: Maybe<ResolversParentTypes['GameVote']> };
  Game: never;
  GameMeta: GameMeta;
  AdditionalEntityFields: AdditionalEntityFields;
}>;

export type UnionDirectiveArgs = {   discriminatorField?: Maybe<Scalars['String']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {   discriminatorField: Scalars['String'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {   embedded?: Maybe<Scalars['Boolean']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {   overrideType?: Maybe<Scalars['String']>; };

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = {  };

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {   overrideType?: Maybe<Scalars['String']>; };

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = {  };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {   path: Scalars['String']; };

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  room?: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType, RequireFields<QueryRoomArgs, 'id'>>;
  roomByCode?: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType, RequireFields<QueryRoomByCodeArgs, 'code'>>;
  games?: Resolver<Array<Maybe<ResolversTypes['GameMeta']>>, ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  login?: Resolver<Maybe<ResolversTypes['LoginMutationResponse']>, ParentType, ContextType, RequireFields<MutationLoginArgs, never>>;
  createRoom?: Resolver<Maybe<ResolversTypes['CreateRoomMutationResponse']>, ParentType, ContextType>;
  joinRoom?: Resolver<Maybe<ResolversTypes['JoinRoomMutationResponse']>, ParentType, ContextType, RequireFields<MutationJoinRoomArgs, never>>;
  voteForGame?: Resolver<Maybe<ResolversTypes['VoteForGameMutationResponse']>, ParentType, ContextType, RequireFields<MutationVoteForGameArgs, never>>;
}>;

export type MutationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MutationResponse'] = ResolversParentTypes['MutationResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LoginMutationResponse' | 'CreateRoomMutationResponse' | 'JoinRoomMutationResponse' | 'VoteForGameMutationResponse', ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type LoginMutationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginMutationResponse'] = ResolversParentTypes['LoginMutationResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['URL']>, ParentType, ContextType>;
  player?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType>;
  room?: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlayerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = ResolversObject<{
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type RoomResolvers<ContextType = any, ParentType extends ResolversParentTypes['Room'] = ResolversParentTypes['Room']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  leader?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  users?: Resolver<Array<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
  currentGame?: Resolver<Maybe<ResolversTypes['Game']>, ParentType, ContextType>;
  gameVotes?: Resolver<Array<Maybe<ResolversTypes['GameVote']>>, ParentType, ContextType>;
  gameHistory?: Resolver<Maybe<Array<Maybe<ResolversTypes['Game']>>>, ParentType, ContextType>;
  dateCreated?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateRoomMutationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateRoomMutationResponse'] = ResolversParentTypes['CreateRoomMutationResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  room?: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type JoinRoomMutationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['JoinRoomMutationResponse'] = ResolversParentTypes['JoinRoomMutationResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  room?: Resolver<Maybe<ResolversTypes['Room']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GameVoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameVote'] = ResolversParentTypes['GameVote']> = ResolversObject<{
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  game?: Resolver<ResolversTypes['GameMeta'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VoteForGameMutationResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoteForGameMutationResponse'] = ResolversParentTypes['VoteForGameMutationResponse']> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vote?: Resolver<Maybe<ResolversTypes['GameVote']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GameResolvers<ContextType = any, ParentType extends ResolversParentTypes['Game'] = ResolversParentTypes['Game']> = ResolversObject<{
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  winners?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  dateStarted?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  dateEnded?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
}>;

export type GameMetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['GameMeta'] = ResolversParentTypes['GameMeta']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  coverImage?: Resolver<Maybe<ResolversTypes['URL']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Date?: GraphQLScalarType;
  URL?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MutationResponse?: MutationResponseResolvers<ContextType>;
  LoginMutationResponse?: LoginMutationResponseResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  Room?: RoomResolvers<ContextType>;
  CreateRoomMutationResponse?: CreateRoomMutationResponseResolvers<ContextType>;
  JoinRoomMutationResponse?: JoinRoomMutationResponseResolvers<ContextType>;
  GameVote?: GameVoteResolvers<ContextType>;
  VoteForGameMutationResponse?: VoteForGameMutationResponseResolvers<ContextType>;
  Game?: GameResolvers<ContextType>;
  GameMeta?: GameMetaResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
}>;


/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;
import { ObjectID } from 'mongodb';
export type UserDbObject = {
  _id: ObjectID,
  username: string,
  image?: Maybe<URL>,
  player?: Maybe<Player>,
  room?: Maybe<Room>,
  token?: Maybe<string>,
};

export type RoomDbObject = {
  _id: ObjectID,
  code: string,
  leader: User,
  users: Array<Maybe<User>>,
  currentGame?: Maybe<Game>,
  gameVotes: Array<Maybe<GameVote>>,
  gameHistory?: Maybe<Array<Maybe<Game>>>,
  dateCreated: Date,
};

export type GameVoteDbObject = {};

export type GameMetaDbObject = {
  _id: ObjectID,
  name: string,
  coverImage?: Maybe<URL>,
};
