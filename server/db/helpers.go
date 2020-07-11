package db

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

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

	return n != 0
}

// CheckUsername checks the supplied username against all the usernames already
// in the collection.
func (c *Client) CheckUsername(username string) bool {
	// Not handling errors since errors are basiclly meaningless here
	n, err := c.UserCollection.CountDocuments(
		context.TODO(), bson.M{"username": username},
	)

	fmt.Println(err)

	return n != 0
}

func (c *Client) Replace(
	col *mongo.Collection,
	id primitive.ObjectID,
	upsert bool, doc interface{},
) error {
	doc, err := bson.Marshal(doc)
	if err != nil {
		return err
	}

	res, err := col.ReplaceOne(
		context.TODO(), bson.M{"_id": id}, doc,
		options.Replace().SetUpsert(upsert),
	)
	if err != nil {
		return err
	}

	if res.UpsertedCount == 0 && res.MatchedCount == 0 {
		return fmt.Errorf("no documents with ID %s found. Nothing to update", id.Hex())
	}

	return nil
}
