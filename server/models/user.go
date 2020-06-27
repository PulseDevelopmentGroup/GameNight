package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID       primitive.ObjectID  `json:"id" bson:"_id"`
	Username string              `json:"username"`
	Nickname *string             `json:"nickname"`
	JWT      *string             `json:"JWT"`
	Image    *string             `json:"image"`
	Player   *primitive.ObjectID `json:"player"`
}
