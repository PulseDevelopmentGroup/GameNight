package db

import (
	"context"
	"fmt"
	"time"

	"github.com/PulseDevelopmentGroup/GameNight/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Client struct {
	Client *mongo.Client
	DB     *mongo.Database

	UserCollection *mongo.Collection
	GameCollection *mongo.Collection
	RoomCollection *mongo.Collection
}

func New(uri string, timeout time.Duration, database string) (*Client, error) {
	ctx, _ := context.WithTimeout(context.Background(), timeout)
	c, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://"+uri))
	if err != nil {
		return &Client{}, err
	}

	db := c.Database(database)
	return &Client{
		Client: c,
		DB:     db,

		UserCollection: db.Collection("users"),
		GameCollection: db.Collection("games"),
		RoomCollection: db.Collection("rooms"),
	}, nil
}

/* === Rooms === */
func (c *Client) CreateRoom(leader *models.User) (*models.Room, error) {
	code := c.getCode(6)

	r := &models.Room{
		ID:          primitive.NewObjectID(),
		Code:        code,
		Leader:      leader.ID,
		Users:       []primitive.ObjectID{leader.ID},
		DateCreated: time.Now().Format("01-02-2006"),
	}

	document, err := bson.Marshal(r)
	if err != nil {
		return r, err
	}

	_, err = c.RoomCollection.InsertOne(context.TODO(), document)
	if err != nil {
		return r, err
	}

	return r, nil
}

func (c *Client) GetRoomWithCode(code string) (*models.Room, error) {
	var result *models.Room

	err := c.RoomCollection.FindOne(context.TODO(), bson.M{"code": code}).Decode(&result)
	return result, err
}

func (c *Client) GetRoomWithID(id primitive.ObjectID) (*models.Room, error) {
	var result *models.Room

	err := c.RoomCollection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&result)
	return result, err
}

func (c *Client) JoinRoom(code string, user *models.User) (*models.Room, error) {
	room, err := c.GetRoomWithCode(code)
	if err != nil {
		return &models.Room{}, fmt.Errorf(
			"Unable to find room with code %s", code,
		)
	}

	room.Users = append(room.Users, user.ID)

	return c.updateRoom(room)
}

// TODO: This function will need work once this feature is implemented
func (c *Client) LeaveRoom(room *models.Room, user *models.User) error {
	//TODO
	return nil
}

// TODO: This function will need work once this feature is implemented
func (c *Client) RemoveRoom(room *models.Room) error {
	_, err := c.RoomCollection.DeleteOne(context.TODO(), bson.M{"_id": room.ID})
	if err != nil {
		return err
	}
	return nil
}

func (c *Client) updateRoom(room *models.Room) (*models.Room, error) {
	d, err := bson.Marshal(room)
	if err != nil {
		return &models.Room{}, err
	}

	res, err := c.RoomCollection.UpdateOne(
		context.TODO(), bson.M{"_id": room.ID}, d,
	)
	if err != nil {
		return &models.Room{}, err
	}

	if res.MatchedCount == 0 {
		return &models.Room{}, fmt.Errorf(
			"No room matching ID %s found.", room.ID.Hex(),
		)
	}

	return room, nil
}

/* === End Rooms === */

/* === Users === */

func (c *Client) CreateUser(username string) (*models.User, error) {
	if !c.checkUsername(username) {
		return &models.User{}, fmt.Errorf("User already exists")
	}

	u := &models.User{
		ID:       primitive.NewObjectID(),
		Username: username,
		Nickname: username,
	}

	document, err := bson.Marshal(u)
	if err != nil {
		return u, err
	}

	_, err = c.UserCollection.InsertOne(context.TODO(), document)
	if err != nil {
		return u, err
	}

	return u, nil
}

func (c *Client) GetUser(id primitive.ObjectID) (*models.User, error) {
	var result *models.User

	err := c.UserCollection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&result)
	return result, err
}

/* === End Users === */

/* === Games === */

func (c *Client) GetGame(id primitive.ObjectID) (*models.Game, error) {
	var result *models.Game

	err := c.GameCollection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&result)
	return result, err
}

/* === End Games === */
