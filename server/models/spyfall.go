package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (SypfallGame) IsGame() {}

type SypfallGame struct {
	ID          primitive.ObjectID    `json:"id"`
	IsComplete  bool                  `json:"isComplete"`
	Winners     []User                `json:"winners"`
	DateStarted time.Time             `json:"dateStarted"`
	DateEnded   *time.Time            `json:"dateEnded"`
	Players     []*primitive.ObjectID `json:"players"`
	Location    string                `json:"location"`
}

func (SpyfallPlayer) IsPlayer() {}

type SpyfallPlayer struct {
	ID    primitive.ObjectID `json:"id"`
	User  primitive.ObjectID `json:"user"`
	IsSpy bool               `json:"isSpy"`
	Role  string             `json:"role"`
}
