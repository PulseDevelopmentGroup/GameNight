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

/* === Start Rooms === */
func (c *Client) CreateRoom(leader *models.User) (*models.Room, error) {
	code := c.checkCode(6)

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

	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	_, err = c.RoomCollection.InsertOne(ctx, document)
	if err != nil {
		return r, err
	}

	return r, nil
}

func (c *Client) GetRoomWithCode(code string) (*models.Room, error) {
	var result *models.Room

	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	err := c.RoomCollection.FindOne(ctx, bson.M{"code": code}).Decode(&result)
	return result, err
}

func (c *Client) GetRoomWithID(id primitive.ObjectID) (*models.Room, error) {
	var result *models.Room

	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	err := c.RoomCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&result)
	return result, err
}

/* === End Rooms === */

/* === Start Users === */

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

	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	_, err = c.UserCollection.InsertOne(ctx, document)
	if err != nil {
		return u, err
	}

	return u, nil
}

func (c *Client) GetUser(id primitive.ObjectID) (*models.User, error) {
	var result *models.User

	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	err := c.UserCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&result)
	return result, err
}

/* === End Users === */

/* === Start Games === */

func (c *Client) GetGame(id primitive.ObjectID) (*models.Game, error) {
	var result *models.Game

	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	err := c.GameCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&result)
	return result, err
}

/* === End Games === */
