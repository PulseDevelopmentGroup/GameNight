package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Room struct {
	ID          primitive.ObjectID   `json:"id"`
	Code        string               `json:"code"`
	Leader      primitive.ObjectID   `json:"leader"`
	Users       []primitive.ObjectID `json:"users"`
	CurrentGame *primitive.ObjectID  `json:"currentGame"`
	GameVotes   []*GameVote          `json:"gameVotes"`
	GameHistory []primitive.ObjectID `json:"gameHistory"`
	DateCreated time.Time            `json:"dateCreated"`
}

type CreateRoomInput struct {
	Nickname string `json:"username"`
}

type CreateRoomMutationResponse struct {
	Code    string `json:"code"`
	Success bool   `json:"success"`
	Message string `json:"message"`
	Room    *Room  `json:"room"`
	User    *User  `json:"user"`
}

func (CreateRoomMutationResponse) IsMutationResponse() {}

type JoinRoomInput struct {
	Nickname string `json:"username"`
	RoomCode string `json:"roomCode"`
}

type JoinRoomMutationResponse struct {
	Code    string `json:"code"`
	Success bool   `json:"success"`
	Message string `json:"message"`
	Room    *Room  `json:"room"`
	User    *User  `json:"user"`
}

func (JoinRoomMutationResponse) IsMutationResponse() {}
