package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/PulseDevelopmentGroup/GameNight/gql"
	"github.com/PulseDevelopmentGroup/GameNight/models"
)

func (r *gameHistoryResolver) Game(ctx context.Context, obj *models.GameHistory) (*models.Game, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *gameVoteResolver) Game(ctx context.Context, obj *models.GameVote) (*models.Game, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) VoteForGame(ctx context.Context, voteInput *models.VoteForGameInput) (*models.VoteForGameMutationResponse, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) User(ctx context.Context, id string) (*models.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Room(ctx context.Context, id string) (*models.Room, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) RoomByCode(ctx context.Context, code string) (*models.Room, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Games(ctx context.Context) ([]*models.Game, error) {
	panic(fmt.Errorf("not implemented"))
}

// GameHistory returns gql.GameHistoryResolver implementation.
func (r *Resolver) GameHistory() gql.GameHistoryResolver { return &gameHistoryResolver{r} }

// GameVote returns gql.GameVoteResolver implementation.
func (r *Resolver) GameVote() gql.GameVoteResolver { return &gameVoteResolver{r} }

// Mutation returns gql.MutationResolver implementation.
func (r *Resolver) Mutation() gql.MutationResolver { return &mutationResolver{r} }

// Query returns gql.QueryResolver implementation.
func (r *Resolver) Query() gql.QueryResolver { return &queryResolver{r} }

// Room returns gql.RoomResolver implementation.
func (r *Resolver) Room() gql.RoomResolver { return &roomResolver{r} }

// User returns gql.UserResolver implementation.
func (r *Resolver) User() gql.UserResolver { return &userResolver{r} }

type gameHistoryResolver struct{ *Resolver }
type gameVoteResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type roomResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
