package hub

import (
	"time"

	"github.com/PulseDevelopmentGroup/GameNight/db"
	"github.com/PulseDevelopmentGroup/GameNight/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"

	"fmt"
)

type Hub struct {
	DB  *db.Client
	Log *zap.Logger
}

// Most of the functions in the "hub" package could easily be moved to the DB
// package. They're here moreso for future-proofing where moving everything into
// the DB package wouldn't be reasonable.

// New creates a new hub object for performing actions which consist of core app
// functionality.
func New(database *db.Client, log *zap.Logger) *Hub {
	return &Hub{
		DB:  database,
		Log: log,
	}
}

// CreateRoom creates a new room and it's first user using the supplied username
func (h *Hub) CreateRoom(username string) (*models.Room, *models.User, error) {
	user, err := h.newUser(username)
	if err != nil {
		return &models.Room{}, &models.User{}, fmt.Errorf(
			"Unable to create user: '%s'", err,
		)
	}

	room, err := h.newRoom(user)
	if err != nil {
		return &models.Room{}, user, fmt.Errorf(
			"Unable to create room: '%s'", err,
		)
	}

	return room, user, nil

}

// Join room creates a new user and joins an existing room using the supplied
// room code and username.
func (h *Hub) JoinRoom(code, username string) (*models.Room, *models.User, error) {
	user, err := h.newUser(username)
	if err != nil {
		return &models.Room{}, &models.User{}, fmt.Errorf(
			"Unable to create user: '%s'", err,
		)
	}

	room, err := h.DB.GetRoom(code)
	if err != nil {
		return &models.Room{}, user, fmt.Errorf(
			"Unable to get room to join: '%s'", err,
		)
	}

	room.Users = append(room.Users, user.ID)

	err = h.DB.SetRoom(room, false)
	if err != nil {
		return room, user, fmt.Errorf(
			"Unable to update room: '%s'", err,
		)
	}

	return room, user, nil
}

/*

=== Private Helper Functions ===

*/
func (h *Hub) newRoom(leader *models.User) (*models.Room, error) {
	room := &models.Room{
		ID:          primitive.NewObjectID(),
		Code:        h.DB.NewRoomCode(6),
		DateCreated: time.Now().Format("01-02-2006"),
		Leader:      leader.ID,
		Users:       []primitive.ObjectID{leader.ID},
	}

	err := h.DB.SetRoom(room, true)
	if err != nil {
		return room, err
	}

	return room, nil
}

func (h *Hub) newUser(username string) (*models.User, error) {
	user := &models.User{
		ID:       primitive.NewObjectID(),
		Username: username,
		Nickname: username,
	}

	err := h.DB.SetUser(user, true)
	if err != nil {
		return user, err
	}

	return user, nil
}
