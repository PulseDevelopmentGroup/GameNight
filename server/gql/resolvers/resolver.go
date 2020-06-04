package resolvers

import (
	"context"

	"github.com/PulseDevelopmentGroup/GameNight/db"
	"github.com/PulseDevelopmentGroup/GameNight/models"
	"go.uber.org/zap"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB  *db.Client
	Log *zap.Logger
}

/* === Start Resolvers for getting object from ID === */

func (r *gameHistoryResolver) Game(ctx context.Context, obj *models.GameHistory) (*models.Game, error) {
	return r.DB.GetGame(obj.Game)
}

func (r *gameHistoryResolver) Users(ctx context.Context, obj *models.GameHistory) ([]*models.User, error) {
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

func (r *gameVoteResolver) User(ctx context.Context, obj *models.GameVote) (*models.User, error) {
	return r.DB.GetUser(*obj.User)
}

func (r *gameVoteResolver) Game(ctx context.Context, obj *models.GameVote) (*models.Game, error) {
	return r.DB.GetGame(*obj.Game)
}

func (r *roomResolver) Leader(ctx context.Context, obj *models.Room) (*models.User, error) {
	return r.DB.GetUser(obj.Leader)
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

func (r *roomResolver) CurrentGame(ctx context.Context, obj *models.Room) (*models.Game, error) {
	return r.DB.GetGame(obj.CurrentGame)
}

/* === End Resolvers for getting object from ID === */

/* === Start Primary Resolvers === */
func (r *mutationResolver) CreateRoom(ctx context.Context, roomInput *models.CreateRoomInput) (*models.CreateRoomMutationResponse, error) {
	user, err := r.DB.CreateUser(roomInput.Username)
	if err != nil {
		return &models.CreateRoomMutationResponse{}, err
	}

	room, err := r.DB.CreateRoom(user)
	if err != nil {
		return &models.CreateRoomMutationResponse{}, err
	}

	return &models.CreateRoomMutationResponse{
		Code:    "200",
		Success: true,
		Message: "Created Room",
		Room:    room,
	}, nil
}

func (r *mutationResolver) JoinRoom(ctx context.Context, joinInput *models.JoinRoomInput) (*models.JoinRoomMutationResponse, error) {
	user, err := r.DB.CreateUser(joinInput.Username)
	if err != nil {
		return &models.JoinRoomMutationResponse{}, err
	}

	room, err := r.DB.JoinRoom(joinInput.RoomCode, user)
	if err != nil {
		return &models.JoinRoomMutationResponse{}, err
	}

	return &models.JoinRoomMutationResponse{
		Code:    "200",
		Success: true,
		Message: "Joined room successfully",
		Room:    room,
		User:    user,
	}, nil
}

/* === End Primary Resolvers === */
