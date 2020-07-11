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

	if c.Exists(c.Rooms, "code", code) {
		return c.NewRoomCode(length)
	}

	return code
}

// Exists checks the supplied collection's documents to see if the supplied
// key-value pair exists.
func (c *Client) Exists(
	collection *mongo.Collection,
	key string, value interface{},
) bool {
	// Not handling errors since errors are basiclly meaningless here
	n, _ := collection.CountDocuments(
		context.TODO(), bson.M{key: value},
	)
	return n != 0
}

// Get gets a document from the supplied collection, decoding it into the
// supplied result interface (make sure to supply the right one for what you're
// after!)
func (c *Client) Get(
	collection *mongo.Collection,
	id primitive.ObjectID, result interface{},
) error {
	return collection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&result)
}

// Set sets a documemt in the supplied collection. If a document with a matching
// ID already exists, it updates the document accordingly.
func (c *Client) Set(
	collection *mongo.Collection,
	id primitive.ObjectID,
	upsert bool, doc interface{},
) error {
	doc, err := bson.Marshal(doc)
	if err != nil {
		return err
	}

	res, err := collection.ReplaceOne(
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

// Del removes a document in the supplied collection.
func (c *Client) Del(collection *mongo.Collection, id primitive.ObjectID) error {
	_, err := collection.DeleteOne(context.TODO(), bson.M{"_id": id})
	if err != nil {
		return err
	}
	return nil
}
