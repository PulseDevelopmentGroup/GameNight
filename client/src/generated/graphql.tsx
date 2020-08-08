import gql from 'graphql-tag';
import * as React from 'react';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactComponents from '@apollo/react-components';
import * as ApolloReactHoc from '@apollo/react-hoc';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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



export type MutationResponse = {
  code: Scalars['String'];
  success: Scalars['Boolean'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
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

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  nickname?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['URL']>;
  jwt?: Maybe<Scalars['String']>;
  player?: Maybe<Player>;
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

export type CreateRoomInput = {
  username: Scalars['String'];
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
  username: Scalars['String'];
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
  isComplete: Scalars['Boolean'];
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

export type GameVote = {
  __typename?: 'GameVote';
  user: User;
  game: GameMeta;
};

export type SpyfallGame = Game & {
  __typename?: 'SpyfallGame';
  id: Scalars['ID'];
  isComplete: Scalars['Boolean'];
  winners?: Maybe<Array<Maybe<User>>>;
  dateStarted: Scalars['Date'];
  dateEnded?: Maybe<Scalars['Date']>;
  players?: Maybe<Array<Maybe<SpyfallPlayer>>>;
  location: Scalars['String'];
};

export type SpyfallPlayer = Player & {
  __typename?: 'SpyfallPlayer';
  id: Scalars['ID'];
  user: User;
  isSpy: Scalars['Boolean'];
  role: Scalars['String'];
};

export type GetRoomCodeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRoomCodeQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'currentRoom'>
);

export type CreateRoomMutationVariables = Exact<{
  input: CreateRoomInput;
}>;


export type CreateRoomMutation = (
  { __typename?: 'Mutation' }
  & { createRoom?: Maybe<(
    { __typename?: 'CreateRoomMutationResponse' }
    & Pick<CreateRoomMutationResponse, 'code' | 'success' | 'message'>
    & { room?: Maybe<(
      { __typename?: 'Room' }
      & Pick<Room, 'id' | 'code'>
    )>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
    )> }
  )> }
);

export type JoinRoomMutationVariables = Exact<{
  input: JoinRoomInput;
}>;


export type JoinRoomMutation = (
  { __typename?: 'Mutation' }
  & { joinRoom?: Maybe<(
    { __typename?: 'JoinRoomMutationResponse' }
    & Pick<JoinRoomMutationResponse, 'code' | 'success' | 'message'>
    & { room?: Maybe<(
      { __typename?: 'Room' }
      & Pick<Room, 'id' | 'code'>
    )>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id'>
    )> }
  )> }
);


export const GetRoomCodeDocument = gql`
    query GetRoomCode {
  currentRoom @client
}
    `;
export type GetRoomCodeComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetRoomCodeQuery, GetRoomCodeQueryVariables>, 'query'>;

    export const GetRoomCodeComponent = (props: GetRoomCodeComponentProps) => (
      <ApolloReactComponents.Query<GetRoomCodeQuery, GetRoomCodeQueryVariables> query={GetRoomCodeDocument} {...props} />
    );
    
export type GetRoomCodeProps<TChildProps = {}, TDataName extends string = 'data'> = {
      [key in TDataName]: ApolloReactHoc.DataValue<GetRoomCodeQuery, GetRoomCodeQueryVariables>
    } & TChildProps;
export function withGetRoomCode<TProps, TChildProps = {}, TDataName extends string = 'data'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  GetRoomCodeQuery,
  GetRoomCodeQueryVariables,
  GetRoomCodeProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withQuery<TProps, GetRoomCodeQuery, GetRoomCodeQueryVariables, GetRoomCodeProps<TChildProps, TDataName>>(GetRoomCodeDocument, {
      alias: 'getRoomCode',
      ...operationOptions
    });
};

/**
 * __useGetRoomCodeQuery__
 *
 * To run a query within a React component, call `useGetRoomCodeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomCodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomCodeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRoomCodeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRoomCodeQuery, GetRoomCodeQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRoomCodeQuery, GetRoomCodeQueryVariables>(GetRoomCodeDocument, baseOptions);
      }
export function useGetRoomCodeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRoomCodeQuery, GetRoomCodeQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRoomCodeQuery, GetRoomCodeQueryVariables>(GetRoomCodeDocument, baseOptions);
        }
export type GetRoomCodeQueryHookResult = ReturnType<typeof useGetRoomCodeQuery>;
export type GetRoomCodeLazyQueryHookResult = ReturnType<typeof useGetRoomCodeLazyQuery>;
export type GetRoomCodeQueryResult = ApolloReactCommon.QueryResult<GetRoomCodeQuery, GetRoomCodeQueryVariables>;
export const CreateRoomDocument = gql`
    mutation CreateRoom($input: CreateRoomInput!) {
  createRoom(createInput: $input) {
    code
    success
    message
    room {
      id
      code
    }
    user {
      id
    }
  }
}
    `;
export type CreateRoomMutationFn = ApolloReactCommon.MutationFunction<CreateRoomMutation, CreateRoomMutationVariables>;
export type CreateRoomComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<CreateRoomMutation, CreateRoomMutationVariables>, 'mutation'>;

    export const CreateRoomComponent = (props: CreateRoomComponentProps) => (
      <ApolloReactComponents.Mutation<CreateRoomMutation, CreateRoomMutationVariables> mutation={CreateRoomDocument} {...props} />
    );
    
export type CreateRoomProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
      [key in TDataName]: ApolloReactCommon.MutationFunction<CreateRoomMutation, CreateRoomMutationVariables>
    } & TChildProps;
export function withCreateRoom<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  CreateRoomMutation,
  CreateRoomMutationVariables,
  CreateRoomProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withMutation<TProps, CreateRoomMutation, CreateRoomMutationVariables, CreateRoomProps<TChildProps, TDataName>>(CreateRoomDocument, {
      alias: 'createRoom',
      ...operationOptions
    });
};

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoomMutation, { data, loading, error }] = useCreateRoomMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateRoomMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateRoomMutation, CreateRoomMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, baseOptions);
      }
export type CreateRoomMutationHookResult = ReturnType<typeof useCreateRoomMutation>;
export type CreateRoomMutationResult = ApolloReactCommon.MutationResult<CreateRoomMutation>;
export type CreateRoomMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateRoomMutation, CreateRoomMutationVariables>;
export const JoinRoomDocument = gql`
    mutation JoinRoom($input: JoinRoomInput!) {
  joinRoom(joinInput: $input) {
    code
    success
    message
    room {
      id
      code
    }
    user {
      id
    }
  }
}
    `;
export type JoinRoomMutationFn = ApolloReactCommon.MutationFunction<JoinRoomMutation, JoinRoomMutationVariables>;
export type JoinRoomComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<JoinRoomMutation, JoinRoomMutationVariables>, 'mutation'>;

    export const JoinRoomComponent = (props: JoinRoomComponentProps) => (
      <ApolloReactComponents.Mutation<JoinRoomMutation, JoinRoomMutationVariables> mutation={JoinRoomDocument} {...props} />
    );
    
export type JoinRoomProps<TChildProps = {}, TDataName extends string = 'mutate'> = {
      [key in TDataName]: ApolloReactCommon.MutationFunction<JoinRoomMutation, JoinRoomMutationVariables>
    } & TChildProps;
export function withJoinRoom<TProps, TChildProps = {}, TDataName extends string = 'mutate'>(operationOptions?: ApolloReactHoc.OperationOption<
  TProps,
  JoinRoomMutation,
  JoinRoomMutationVariables,
  JoinRoomProps<TChildProps, TDataName>>) {
    return ApolloReactHoc.withMutation<TProps, JoinRoomMutation, JoinRoomMutationVariables, JoinRoomProps<TChildProps, TDataName>>(JoinRoomDocument, {
      alias: 'joinRoom',
      ...operationOptions
    });
};

/**
 * __useJoinRoomMutation__
 *
 * To run a mutation, you first call `useJoinRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinRoomMutation, { data, loading, error }] = useJoinRoomMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useJoinRoomMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<JoinRoomMutation, JoinRoomMutationVariables>) {
        return ApolloReactHooks.useMutation<JoinRoomMutation, JoinRoomMutationVariables>(JoinRoomDocument, baseOptions);
      }
export type JoinRoomMutationHookResult = ReturnType<typeof useJoinRoomMutation>;
export type JoinRoomMutationResult = ApolloReactCommon.MutationResult<JoinRoomMutation>;
export type JoinRoomMutationOptions = ApolloReactCommon.BaseMutationOptions<JoinRoomMutation, JoinRoomMutationVariables>;