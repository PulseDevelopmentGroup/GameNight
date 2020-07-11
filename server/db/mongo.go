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

	DictID primitive.ObjectID

	Users, Games, Rooms, Players, GameMeta, GameDict *mongo.Collection
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

		DictID: primitive.NewObjectID(),

		Users:    db.Collection("users"),
		Games:    db.Collection("games"),
		Rooms:    db.Collection("rooms"),
		Players:  db.Collection("players"),
		GameMeta: db.Collection("gamemeta"),
		GameDict: db.Collection("gamedict"),
	}, nil
}

// Disconnect gracefully disconnects from the database
func (c *Client) Disconnect(ctx context.Context) error {
	return c.client.Disconnect(ctx)
}

/* === Meta === */

func (c *Client) GetGameMeta(id primitive.ObjectID) (*models.GameMeta, error) {
	result := new(models.GameMeta)

	err := c.Get(c.GameMeta, id).Decode(&result)
	return result, err
}

func (c *Client) SetGameMeta(game *models.GameMeta) error {
	if c.Exists(c.GameMeta, "name", game.Name) {
		return nil
	}

	return c.Set(c.GameMeta, game.ID, true, game)
}

func (c *Client) DelGameMeta(id primitive.ObjectID) error {
	return c.Del(c.GameMeta, id)
}

/* === End Meta === */

/* === Dict === */

func (c *Client) GetGameDict(gameID primitive.ObjectID) (models.Game, error) {
	result := new(models.GameDictEntry)

	if err := c.Get(c.GameDict, gameID).Decode(&result); err != nil {
		return models.NullGame{}, err
	}

	switch result.Type {
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

func (c *Client) SetGameDict(entry *models.GameDictEntry) error {
	return c.Set(c.GameDict, entry.ID, true, entry)
}

func (c *Client) DelGameDict(gameID primitive.ObjectID) error {
	return c.Del(c.GameDict, gameID)
}

/* === End Dict === */

/* === Rooms === */

// GetRoom accepts either a room code (string) or ID (primitive.ObjectID) and
// returns any rooms it discovers.
func (c *Client) GetRoom(v interface{}) (*models.Room, error) {
	result := new(models.Room)

	switch r := v.(type) {
	case primitive.ObjectID:
		err := c.Get(c.Rooms, v.(primitive.ObjectID)).Decode(&result)
		return result, err
	case string:
		err := c.Rooms.FindOne(
			context.TODO(), bson.M{"code": v.(string)},
		).Decode(&result)
		return result, err
	default:
		return &models.Room{}, fmt.Errorf("%T is not an ObjectID or string", r)
	}
}

// SetRoom takes a room model and an insert switch to update a room in the db.
// If insert is true and a room with a matching ID does not already exist, a new
// room will be created.
func (c *Client) SetRoom(room *models.Room, insert bool) error {
	if insert && c.Exists(c.Users, "code", room.Code) {
		return fmt.Errorf("room with code %s already exists", room.Code)
	}

	return c.Set(c.Rooms, room.ID, insert, room)
}

// DelRoom removes the supplied room from the collection.
func (c *Client) DelRoom(room *models.Room) error {
	return c.Del(c.Rooms, room.ID)
}

/* === End Rooms === */

/* === Users === */

// GetUser accepts either a username (string) or ID (primitive.ObjectID) and
// returns the user it discovers.
func (c *Client) GetUser(v interface{}) (*models.User, error) {
	result := new(models.User)

	switch u := v.(type) {
	case primitive.ObjectID:
		err := c.Get(c.Users, v.(primitive.ObjectID)).Decode(&result)
		return result, err
	case string:
		err := c.Users.FindOne(
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
	if insert && c.Exists(c.Users, "username", user.Username) {
		return fmt.Errorf("user with username %s already exists", user.Username)
	}

	return c.Set(c.Users, user.ID, insert, user)
}

// DelUser removes the supplied user from the collection.
func (c *Client) DelUser(user *models.User) error {
	return c.Del(c.Users, user.ID)
}

/* === End Users === */

/* === Games === */

// GetGame accepts either a game ID (primitive.ObjectID) as
// well as a result to populate (since a "Game" is inheritly many types).
// Returns the appropriate game.
// TODO: This may be broken. Will have to test
func (c *Client) GetGame(id primitive.ObjectID, game interface{}) error {
	return c.Get(c.Games, id).Decode(&game)
}

// SetGame takes a game model and an insert switch to update a game in the db.
// If insert is true and a game with a matching ID does not already exist, a new
// game will be created.
func (c *Client) SetGame(id primitive.ObjectID, game *interface{}, insert bool) error {
	// TODO:
	return nil
}

// DelRoom removes the supplied room from the collection.
func (c *Client) DelGame(id primitive.ObjectID) error {
	/* Remove the ID/game type association from the dictionary */
	if err := c.DelGameDict(id); err != nil {
		return err
	}

	/* Remove the game itself */
	return c.Del(c.Games, id)
}

/* === End Games === */
