package db

import (
	"context"
	"fmt"

	"github.com/PulseDevelopmentGroup/GameNight/models"
	"go.uber.org/zap"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Client struct {
	client *mongo.Client
	db     *mongo.Database

	log *zap.Logger

	UserCollection *mongo.Collection
	GameCollection *mongo.Collection
	RoomCollection *mongo.Collection
}

type Config struct {
	Addr     string
	Port     int
	Context  context.Context
	Database string
}

var (
	fmtURI = "mongodb://%s:%d"
)

// New creates a new Client database connection using the supplied config and
// logger.
func New(cfg *Config, log *zap.Logger) (*Client, error) {
	c, err := mongo.Connect(
		cfg.Context,
		options.Client().ApplyURI(fmt.Sprintf(fmtURI, cfg.Addr, cfg.Port)),
	)
	if err != nil {
		return &Client{}, err
	}

	err = c.Ping(context.TODO(), nil)
	if err != nil {
		return &Client{}, err
	}

	log.Info("Sucessfully Connected!")

	db := c.Database(cfg.Database)
	return &Client{
		client: c,
		db:     db,
		log:    log,

		UserCollection: db.Collection("users"),
		GameCollection: db.Collection("games"),
		RoomCollection: db.Collection("rooms"),
	}, nil
}

// Disconnect gracefully disconnects from the database
func (c *Client) Disconnect(ctx context.Context) error {
	return c.client.Disconnect(ctx)
}

/* === Rooms === */

// GetRoom accepts either a room code (string) or ID (primitive.ObjectID) and
// returns any rooms it discovers.
func (c *Client) GetRoom(room interface{}) (*models.Room, error) {
	var result *models.Room

	switch r := room.(type) {
	case primitive.ObjectID:
		err := c.RoomCollection.FindOne(
			context.TODO(), bson.M{"_id": room.(primitive.ObjectID)},
		).Decode(&result)
		return result, err
	case string:
		err := c.RoomCollection.FindOne(
			context.TODO(), bson.M{"code": room.(string)},
		).Decode(&result)
		return result, err
	default:
		return &models.Room{}, fmt.Errorf("%T is not an ObjectID or string", r)
	}
}

//TODO: This function may require some troubleshooting
// SetRoom takes a room model and an insert switch to update a room in the db.
// If insert is true and a room with a matching ID does not already exist, a new
// room will be created.
func (c *Client) SetRoom(room *models.Room, insert bool) error {
	if insert && c.CheckRoomCode(room.Code) {
		return fmt.Errorf("room with code %s already exists", room.Code)
	}

	d, err := bson.Marshal(room)
	if err != nil {
		return err
	}

	res, err := c.RoomCollection.ReplaceOne(
		context.TODO(), bson.M{"_id": room.ID}, d,
		options.Replace().SetUpsert(insert),
	)
	if err != nil {
		return err
	}

	if res.UpsertedCount == 0 && res.MatchedCount == 0 {
		return fmt.Errorf("no room with ID %s found.", room.ID.Hex())
	}

	return nil
}

// DelRoom removes the supplied room from the collection.
func (c *Client) DelRoom(room *models.Room) error {
	_, err := c.RoomCollection.DeleteOne(context.TODO(), bson.M{"_id": room.ID})
	if err != nil {
		return err
	}
	return nil
}

/* === End Rooms === */

/* === Users === */

// GetUser accepts either a room code (string) or ID (primitive.ObjectID) and
// returns any rooms it discovers.
func (c *Client) GetUser(user interface{}) (*models.User, error) {
	var result *models.User

	switch u := user.(type) {
	case primitive.ObjectID:
		err := c.UserCollection.FindOne(
			context.TODO(), bson.M{"_id": user.(primitive.ObjectID)},
		).Decode(&result)
		return result, err
	case string:
		err := c.UserCollection.FindOne(
			context.TODO(), bson.M{"username": user.(string)},
		).Decode(&result)
		return result, err
	default:
		return &models.User{}, fmt.Errorf("%T is not an ObjectID or string", u)
	}
}

// SetUser takes a user model and an insert switch to update a user in the db.
// If insert is true and a user with a matching ID does not already exist, a new
// user will be created.
func (c *Client) SetUser(user *models.User, insert bool) error {
	if insert && c.CheckUsername(user.Username) {
		return fmt.Errorf("user with username %s already exists", user.Username)
	}

	d, err := bson.Marshal(user)
	if err != nil {
		return err
	}

	res, err := c.UserCollection.ReplaceOne(
		context.TODO(), bson.M{"_id": user.ID}, d,
		options.Replace().SetUpsert(insert),
	)
	if err != nil {
		return err
	}

	if res.UpsertedCount == 0 && res.MatchedCount == 0 {
		return fmt.Errorf("no users with ID %s found.", user.ID.Hex())
	}

	return nil
}

// DelUser removes the supplied user from the collection.
func (c *Client) DelUser(user *models.User) error {
	_, err := c.UserCollection.DeleteOne(context.TODO(), bson.M{"_id": user.ID})
	if err != nil {
		return err
	}
	return nil
}

/* === End Users === */

/* === Games === */

func (c *Client) GetGame(id primitive.ObjectID) (*models.Game, error) {
	var result *models.Game

	err := c.GameCollection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&result)
	return result, err
}

/* === End Games === */
