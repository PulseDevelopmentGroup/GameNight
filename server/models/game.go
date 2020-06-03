package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Game struct {
	ID         primitive.ObjectID `json:"id" bson:"_id"`
	Name       string             `json:"name"`
	CoverImage *string            `json:"coverImage"`
}

// Might want to add a list of games that have been played?
type GameHistory struct {
	Game        primitive.ObjectID   `json:"game"`
	Users       []primitive.ObjectID `json:"users"`
	DateStarted string               `json:"dateStarted"`
	DateEnded   string               `json:"dateEnded"`
}
