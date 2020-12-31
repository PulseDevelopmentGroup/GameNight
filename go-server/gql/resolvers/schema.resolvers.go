package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"github.com/PulseDevelopmentGroup/GameNight/gql"
)

// GameVote returns gql.GameVoteResolver implementation.
func (r *Resolver) GameVote() gql.GameVoteResolver { return &gameVoteResolver{r} }

// Mutation returns gql.MutationResolver implementation.
func (r *Resolver) Mutation() gql.MutationResolver { return &mutationResolver{r} }

// Query returns gql.QueryResolver implementation.
func (r *Resolver) Query() gql.QueryResolver { return &queryResolver{r} }

// Room returns gql.RoomResolver implementation.
func (r *Resolver) Room() gql.RoomResolver { return &roomResolver{r} }

// SpyfallGame returns gql.SpyfallGameResolver implementation.
func (r *Resolver) SpyfallGame() gql.SpyfallGameResolver { return &spyfallGameResolver{r} }

// SpyfallPlayer returns gql.SpyfallPlayerResolver implementation.
func (r *Resolver) SpyfallPlayer() gql.SpyfallPlayerResolver { return &spyfallPlayerResolver{r} }

// User returns gql.UserResolver implementation.
func (r *Resolver) User() gql.UserResolver { return &userResolver{r} }

type gameVoteResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type roomResolver struct{ *Resolver }
type spyfallGameResolver struct{ *Resolver }
type spyfallPlayerResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
