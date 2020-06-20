package models

import (
	"fmt"
	"io"
	"strconv"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

/* ID to primitive.ObjectID */
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

/* Date to time.Time */
var layout string = "2006-01-02T15:04:05.000Z"

func MarshalDateScalar(date time.Time) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		io.WriteString(w, date.String())
	})
}

func UnmarshalDateScalar(v interface{}) (time.Time, error) {
	switch v := v.(type) {
	case string:
		return time.Parse(layout, v)
	case *string:
		return time.Parse(layout, *v)
	default:
		return time.Time{}, fmt.Errorf("%T is not a string", v)
	}
}
