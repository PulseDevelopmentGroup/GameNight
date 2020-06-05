package db

import (
	"context"

	"github.com/PulseDevelopmentGroup/GameNight/util"
	"go.mongodb.org/mongo-driver/bson"
)

// NewRoomCode returns a new room code matching the supplied length. Will
// validate the uniqueness of the code before returning.
func (c *Client) NewRoomCode(length int) string {
	code := util.GenerateRoomCode(length)

	if c.CheckRoomCode(code) {
		return c.NewRoomCode(length)
	}

	return code
}

// CheckRoomCode checks the supplied code against the rooms already in the
// collection.
func (c *Client) CheckRoomCode(code string) bool {
	// Not handling errors since errors are basiclly meaningless here
	n, _ := c.RoomCollection.CountDocuments(
		context.TODO(), bson.M{"code": code},
	)

	if n != 0 {
		return true
	}
	return false
}

// CheckUsername checks the supplied username against all the usernames already
// in the collection.
func (c *Client) CheckUsername(username string) bool {
	// Not handling errors since errors are basiclly meaningless here
	n, _ := c.UserCollection.CountDocuments(
		context.TODO(), bson.M{"username": username},
	)

	if n != 0 {
		return true
	}
	return false
}
