package db

import (
	"context"

	"github.com/PulseDevelopmentGroup/GameNight/util"
	"go.mongodb.org/mongo-driver/bson"
)

func (c *Client) getCode(length int) string {
	code := util.GenerateRoomCode(length)

	// Not handling errors since errors are basiclly meaningless here
	n, _ := c.RoomCollection.CountDocuments(context.TODO(), bson.M{"code": code})

	if n != 0 {
		return c.getCode(length)
	}
	return code
}

func (c *Client) checkUsername(username string) bool {
	// Not handling errors since errors are basiclly meaningless here
	n, _ := c.RoomCollection.CountDocuments(context.TODO(), bson.M{"username": username})

	if n != 0 {
		return false
	}
	return true
}
