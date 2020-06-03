package models

import (
	"fmt"
	"io"
	"strconv"

	"github.com/99designs/gqlgen/graphql"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func MarshalIDScalar(oid primitive.ObjectID) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		io.WriteString(w, strconv.Quote(oid.Hex()))
	})
}

func UnmarshalIDScalar(v interface{}) (primitive.ObjectID, error) {
	switch v := v.(type) {
	case string:
		oid, _ := primitive.ObjectIDFromHex(v)
		return oid, nil
	case *string:
		oid, _ := primitive.ObjectIDFromHex(*v)
		return oid, nil
	default:
		return primitive.NilObjectID, fmt.Errorf("%T is not a string", v)
	}
}
