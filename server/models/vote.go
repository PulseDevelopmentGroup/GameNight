package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type GameVote struct {
	User *primitive.ObjectID `json:"user"`
	Game *primitive.ObjectID `json:"game"`
}

type VoteForGameInput struct {
	GameID primitive.ObjectID `json:"id" bson:"_id"`
}

type VoteForGameMutationResponse struct {
	Code    string    `json:"code"`
	Success bool      `json:"success"`
	Message string    `json:"message"`
	Vote    *GameVote `json:"vote"`
}

func (VoteForGameMutationResponse) IsMutationResponse() {}
