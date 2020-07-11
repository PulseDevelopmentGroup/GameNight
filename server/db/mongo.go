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
	log    *zap.Logger

	GameDictID primitive.ObjectID

	UserCollection   *mongo.Collection
	GameCollection   *mongo.Collection
	RoomCollection   *mongo.Collection
	PlayerCollection *mongo.Collection
}

type Config struct {
	Addr     string
	Port     int
	Context  context.Context
	Database string
	Username string
	Password string
}

var (
	fmtURI = "mongodb://%s:%d"
)

// New creates a new Client database connection using the supplied config and
// logger.
func New(cfg *Config, log *zap.Logger) (*Client, error) {
	c, err := mongo.Connect(
		cfg.Context,
		options.Client().ApplyURI(
			fmt.Sprintf(fmtURI, cfg.Addr, cfg.Port),
		).SetAuth(options.Credential{
			Username: cfg.Username,
			Password: cfg.Password,
		}),
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

		GameDictID: primitive.NewObjectID(),

		UserCollection:   db.Collection("users"),
		GameCollection:   db.Collection("games"),
		RoomCollection:   db.Collection("rooms"),
		PlayerCollection: db.Collection("players"),
	}, nil
}

// Disconnect gracefully disconnects from the database
func (c *Client) Disconnect(ctx context.Context) error {
	return c.client.Disconnect(ctx)
}

/* === Rooms === */

// GetRoom accepts either a room code (string) or ID (primitive.ObjectID) and
// returns any rooms it discovers.
func (c *Client) GetRoom(v interface{}) (*models.Room, error) {
	var result *models.Room

	switch r := v.(type) {
	case primitive.ObjectID:
		err := c.RoomCollection.FindOne(
			context.TODO(), bson.M{"_id": v.(primitive.ObjectID)},
		).Decode(&result)
		return result, err
	case string:
		err := c.RoomCollection.FindOne(
			context.TODO(), bson.M{"code": v.(string)},
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

	err := c.Replace(c.RoomCollection, room.ID, insert, room)
	if err != nil {
		return err
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

// GetUser accepts either a username (string) or ID (primitive.ObjectID) and
// returns the user it discovers.
func (c *Client) GetUser(v interface{}) (*models.User, error) {
	var result *models.User

	switch u := v.(type) {
	case primitive.ObjectID:
		err := c.UserCollection.FindOne(
			context.TODO(), bson.M{"_id": v.(primitive.ObjectID)},
		).Decode(&result)
		return result, err
	case string:
		err := c.UserCollection.FindOne(
			context.TODO(), bson.M{"username": v.(string)},
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

	err := c.Replace(c.UserCollection, user.ID, insert, user)
	if err != nil {
		return err
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

// GetGameType accepts the ID of a game and return's a model of it's type
func (c *Client) GetGameType(id *primitive.ObjectID) (models.Game, error) {
	var result models.GameType

	err := c.GameCollection.FindOne(
		context.TODO(), bson.M{"_id": c.GameDictID, "types.id": id},
		options.FindOne().SetProjection(bson.M{"types.type": 1}),
	).Decode(&result)

	if err != nil {
		return models.NullGame{}, err
	}

	switch result {
	case models.SpyfallGameType:
		return models.SpyfallGame{}, nil
	case models.CodenamesGameType:
		fallthrough
	case models.NullGameType:
		fallthrough
	default:
		return models.NullGame{},
			fmt.Errorf("game type %v does not exist or is not supported", result)
	}
}

// SetGameType accepts the ID of a game and it's type and associates the two in
// the dictionary.
func (c *Client) SetGameType(id primitive.ObjectID, gt models.GameType) error {
	res, err := c.GameCollection.UpdateOne(
		context.TODO(), bson.M{"_id": c.GameDictID},
		bson.M{"$push": bson.M{"types": models.GameDictType{ID: id, Type: gt}}},
	)
	if err != nil {
		return err
	}

	if res.MatchedCount == 0 {
		return fmt.Errorf("cannot find game dict matching id: %s", id.Hex())
	}

	return nil
}

// GetGame accepts either a game ID (primitive.ObjectID) as
// well as a result to populate (since a "Game" is inheritly many types).
// Returns the appropriate game.
func (c *Client) GetGame(id *primitive.ObjectID, game interface{}) error {
	err := c.GameCollection.FindOne(
		context.TODO(), bson.M{"_id": id},
	).Decode(&game)

	return err
}

// SetGame takes a game model and an insert switch to update a game in the db.
// If insert is true and a game with a matching ID does not already exist, a new
// game will be created.
func (c *Client) SetGame(id primitive.ObjectID, game *models.Game, insert bool) error {
	// TODO:
	return nil
}

// DelRoom removes the supplied room from the collection.
func (c *Client) DelGame(id primitive.ObjectID) error {
	/* Remove the ID/game type association from the dictionary */
	res, err := c.GameCollection.UpdateOne(
		context.TODO(), bson.M{"_id": c.GameDictID},
		bson.M{"$pull": bson.M{"types": bson.M{"id": id}}},
	)
	if err != nil {
		return err
	}

	if res.MatchedCount == 0 {
		return fmt.Errorf("cannot find game dict matching id: %s", id.Hex())
	}

	/* Remove the game itself */
	_, err = c.GameCollection.DeleteOne(context.TODO(), bson.M{"_id": id})
	if err != nil {
		return err
	}
	return nil
}

/* === End Games === */
