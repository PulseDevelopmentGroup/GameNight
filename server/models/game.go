package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

/* === Games === */

type Game interface{ IsGame() }

type NullGame struct{}

func (NullGame) IsGame() {}

type GameMeta struct {
	ID         primitive.ObjectID `json:"id" bson:"_id"`
	Name       string             `json:"name"`
	CoverImage *string            `json:"coverImage"`
}

/* == Game Dict == */
type GameDictEntry struct {
	ID   primitive.ObjectID `json:"id" bson:"_id"`
	Type GameType           `json:"type"`
}

type GameType int

const (
	NullGameType      GameType = 0
	SpyfallGameType   GameType = 1
	CodenamesGameType GameType = 2
)

/* == Spyfall == */

func (SpyfallGame) IsGame() {}

type SpyfallGame struct {
	ID          primitive.ObjectID    `json:"id" bson:"_id"`
	IsComplete  bool                  `json:"isComplete"`
	Winners     []User                `json:"winners"`
	DateStarted time.Time             `json:"dateStarted"`
	DateEnded   *time.Time            `json:"dateEnded"`
	Players     []*primitive.ObjectID `json:"players"`
	Location    string                `json:"location"`
}

/* === Players === */

type Player interface {
	IsPlayer()
}

/* == Spyfall == */

func (SpyfallPlayer) IsPlayer() {}

type SpyfallPlayer struct {
	ID    primitive.ObjectID `json:"id" bson:"_id"`
	User  primitive.ObjectID `json:"user"`
	IsSpy bool               `json:"isSpy"`
	Role  string             `json:"role"`
}
