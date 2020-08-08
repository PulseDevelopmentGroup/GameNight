package hub

import (
	"time"

	"github.com/dgrijalva/jwt-go"

	"github.com/PulseDevelopmentGroup/GameNight/db"
	"github.com/PulseDevelopmentGroup/GameNight/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"

	"fmt"
)

// Hub defines the main control code of the server. Hub is responsible for
// handling logging and interaction with the database.
type Hub struct {
	db  *db.Client
	log *zap.Logger

	tokenSecret string
}

var games = []models.GameMeta{
	models.GameMeta{
		ID:   primitive.NewObjectID(),
		Name: "Spyfall",
	},
	models.GameMeta{
		ID:   primitive.NewObjectID(),
		Name: "Codenames",
	},
}

// New creates a new hub object and initializes the meta database
func New(database *db.Client, sec string, log *zap.Logger) (*Hub, error) {
	h := &Hub{
		db:  database,
		log: log,

		tokenSecret: sec,
	}
	return h, h.initMeta()
}

/*

=== Primary Resolver Functions ===

*/

// CreateRoom creates a new room and it's first user using the supplied username
func (h *Hub) CreateRoom(username string) (*models.Room, *models.User, error) {
	user, err := h.newUser(username)
	if err != nil {
		return &models.Room{}, &models.User{}, fmt.Errorf(
			"unable to create user: '%s'", err,
		)
	}

	room, err := h.newRoom(user)
	if err != nil {
		return &models.Room{}, user, fmt.Errorf(
			"unable to create room: '%s'", err,
		)
	}

	return room, user, nil

}

// JoinRoom creates a new user and joins an existing room using the supplied
// room code and username.
func (h *Hub) JoinRoom(code, username string) (*models.Room, *models.User, error) {
	user, err := h.newUser(username)
	if err != nil {
		return &models.Room{}, &models.User{}, fmt.Errorf(
			"unable to create user: '%s'", err,
		)
	}

	room, err := h.db.GetRoom(code)
	if err != nil {
		return &models.Room{}, user, fmt.Errorf(
			"unable to get room to join: '%s'", err,
		)
	}

	room.Users = append(room.Users, user.ID)

	err = h.db.SetRoom(room, false)
	if err != nil {
		return room, user, fmt.Errorf(
			"unable to update room: '%s'", err,
		)
	}

	return room, user, nil
}

/*

=== Resolver Functions ===

*/

/*

=== Private Helper Functions ===

*/

func (h *Hub) initMeta() error {
	/* Dump game meta into DB */
	h.log.Info("Adding Game Metadata to DB")
	for _, g := range games {
		if err := h.db.SetGameMeta(&g); err != nil {
			return err
		}
	}

	return nil
}

func (h *Hub) newRoom(leader *models.User) (*models.Room, error) {
	room := &models.Room{
		ID:          primitive.NewObjectID(),
		Code:        h.db.NewRoomCode(6),
		DateCreated: time.Now(),
		Leader:      leader.ID,
		Users:       []primitive.ObjectID{leader.ID},
	}

	err := h.db.SetRoom(room, true)
	if err != nil {
		return room, err
	}

	return room, nil
}

func (h *Hub) newUser(username string) (*models.User, error) {
	if len(username) == 0 {
		return &models.User{}, fmt.Errorf("no username supplied")
	}

	id := primitive.NewObjectID()

	token, err := h.newToken(id.Hex())
	if err != nil {
		return &models.User{}, err
	}

	user := &models.User{
		ID:       id,
		Username: username,
		Nickname: &username,
		JWT:      &token,
	}

	err = h.db.SetUser(user, true)
	if err != nil {
		return user, err
	}

	return user, nil
}

func (h *Hub) newToken(userid string) (string, error) {
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["user_id"] = userid
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	at := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := at.SignedString([]byte(h.tokenSecret))
	if err != nil {
		return "", err
	}

	return token, nil
}
