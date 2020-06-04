package db

import (
	"context"

	"github.com/PulseDevelopmentGroup/GameNight/util"
	"go.mongodb.org/mongo-driver/bson"
)

func (c *Client) getCode(length int) string {
	code := util.GenerateRoomCode(length)

	var result string

	c.RoomCollection.FindOne(context.TODO(), bson.M{"code": code}).Decode(result)

	if code == result {
		return c.getCode(length)
	}

	return code
}

func (c *Client) checkUsername(username string) bool {
	var result string

	c.UserCollection.FindOne(context.TODO(), bson.M{"username": username}).Decode(result)

	if len(result) == 0 {
		return true
	}
	return false
}
