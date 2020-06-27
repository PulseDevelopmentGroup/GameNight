package resolvers

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/PulseDevelopmentGroup/GameNight/gql"
	"github.com/PulseDevelopmentGroup/GameNight/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (r *gameVoteResolver) Game(ctx context.Context, obj *models.GameVote) (*models.GameMeta, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *mutationResolver) VoteForGame(ctx context.Context, voteInput *models.VoteForGameInput) (*models.VoteForGameMutationResponse, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Room(ctx context.Context, id primitive.ObjectID) (*models.Room, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) RoomByCode(ctx context.Context, code string) (*models.Room, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Games(ctx context.Context) ([]*models.GameMeta, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *roomResolver) CurrentGame(ctx context.Context, obj *models.Room) (models.Game, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *roomResolver) GameHistory(ctx context.Context, obj *models.Room) ([]models.Game, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *sypfallGameResolver) Players(ctx context.Context, obj *models.SypfallGame) ([]*models.SpyfallPlayer, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userResolver) Player(ctx context.Context, obj *models.User) (models.Player, error) {
	panic(fmt.Errorf("not implemented"))
}

// GameVote returns gql.GameVoteResolver implementation.
func (r *Resolver) GameVote() gql.GameVoteResolver { return &gameVoteResolver{r} }

// Mutation returns gql.MutationResolver implementation.
func (r *Resolver) Mutation() gql.MutationResolver { return &mutationResolver{r} }

// Query returns gql.QueryResolver implementation.
func (r *Resolver) Query() gql.QueryResolver { return &queryResolver{r} }

// Room returns gql.RoomResolver implementation.
func (r *Resolver) Room() gql.RoomResolver { return &roomResolver{r} }

// SpyfallPlayer returns gql.SpyfallPlayerResolver implementation.
func (r *Resolver) SpyfallPlayer() gql.SpyfallPlayerResolver { return &spyfallPlayerResolver{r} }

// SypfallGame returns gql.SypfallGameResolver implementation.
func (r *Resolver) SypfallGame() gql.SypfallGameResolver { return &sypfallGameResolver{r} }

// User returns gql.UserResolver implementation.
func (r *Resolver) User() gql.UserResolver { return &userResolver{r} }

type gameVoteResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type roomResolver struct{ *Resolver }
type spyfallPlayerResolver struct{ *Resolver }
type sypfallGameResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
