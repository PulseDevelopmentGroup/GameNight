package util

import (
	"math/rand"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GenerateRoomCode(length int) string {
	letters := []rune("abcdefghijklmnopqrstuvwxyz")

	b := make([]rune, length)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

// ObjectIDFromStringMustCompile creates a new MongoDB object ID from the
// supplied string. This is meant for situations where object ID's are pre-set
// (at compile time) and MUST NOT be used for dynamic code. Errors result in a
// panic (must like regexp.MustCompile())
func ObjectIDFromStringMustCompile(id string) primitive.ObjectID {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		panic(err)
	}
	return oid
}
