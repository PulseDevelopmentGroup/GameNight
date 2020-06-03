package db

import (
	"context"
	"time"

	"github.com/PulseDevelopmentGroup/GameNight/util"
	"go.mongodb.org/mongo-driver/bson"
)

func (c *Client) checkCode(length int) string {
	code := util.GenerateRoomCode(length)

	var result string

	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	c.RoomCollection.FindOne(ctx, bson.M{"code": code}).Decode(result)

	if code == result {
		return c.checkCode(length)
	}

	return code
}

func (c *Client) checkUsername(username string) bool {
	var result string

	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	c.UserCollection.FindOne(ctx, bson.M{"username": username}).Decode(result)

	if len(result) == 0 {
		return true
	}
	return false
}
