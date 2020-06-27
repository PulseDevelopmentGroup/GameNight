package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Game interface {
	IsGame()
}

type GameMeta struct {
	ID         primitive.ObjectID `json:"id"`
	Name       string             `json:"name"`
	CoverImage *string            `json:"coverImage"`
}
