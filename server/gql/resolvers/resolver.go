package resolvers

import (
	"context"

	"github.com/PulseDevelopmentGroup/GameNight/models"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/PulseDevelopmentGroup/GameNight/db"
	"github.com/PulseDevelopmentGroup/GameNight/hub"
	"go.uber.org/zap"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	Hub *hub.Hub
	DB  *db.Client
	Log *zap.Logger
}

/* === ObjectID to model resolvers === */

// The following resolvers call the database ("db" package) API directly to
// resolve ObjectIDs.

func (r *spyfallPlayerResolver) User(ctx context.Context, obj *models.SpyfallPlayer) (*models.User, error) {
	return r.DB.GetUser(obj.User)
}

func (r *gameVoteResolver) User(ctx context.Context, obj *models.GameVote) (*models.User, error) {
	return r.DB.GetUser(obj.User)
}

func (r *queryResolver) User(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
	return r.DB.GetUser(id)
}

func (r *roomResolver) Users(ctx context.Context, obj *models.Room) ([]*models.User, error) {
	var users []*models.User

	for _, id := range obj.Users {
		user, err := r.DB.GetUser(id)
		if err != nil {
			return users, err
		}

		users = append(users, user)
	}

	return users, nil
}

func (r *roomResolver) Leader(ctx context.Context, obj *models.Room) (*models.User, error) {
	return r.DB.GetUser(obj.Leader)
}

func (r *roomResolver) CurrentGame(ctx context.Context, obj *models.Room) (models.Game, error) {
	game, err := r.DB.GetGameType(obj.CurrentGame)
	if err != nil {
		return game, err
	}

	err = r.DB.GetGame(obj.CurrentGame, game)
	if err != nil {
		return game, err
	}

	return game, nil
}

/* === End ObjectID to model resolvers === */

/* === Start Primary Resolvers === */
func (r *mutationResolver) CreateRoom(ctx context.Context, createInput *models.CreateRoomInput) (*models.CreateRoomMutationResponse, error) {
	room, user, err := r.Hub.CreateRoom(createInput.Username)
	if err != nil {
		return &models.CreateRoomMutationResponse{
			Code:    "500",
			Success: false,
			Message: err.Error(),
			Room:    room,
			User:    user,
		}, err
	}

	return &models.CreateRoomMutationResponse{
		Code:    "200",
		Success: true,
		Message: "Created room",
		Room:    room,
		User:    user,
	}, nil
}

func (r *mutationResolver) JoinRoom(ctx context.Context, joinInput *models.JoinRoomInput) (*models.JoinRoomMutationResponse, error) {
	room, user, err := r.Hub.JoinRoom(joinInput.RoomCode, joinInput.Username)
	if err != nil {
		return &models.JoinRoomMutationResponse{
			Code:    "500",
			Success: false,
			Message: err.Error(),
			Room:    room,
			User:    user,
		}, err
	}

	return &models.JoinRoomMutationResponse{
		Code:    "200",
		Success: true,
		Message: "Joined room",
		Room:    room,
		User:    user,
	}, nil
}

/* === End Primary Resolvers === */
