package main

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gofiber/fiber"

	"github.com/PulseDevelopmentGroup/GameNight/db"
	"github.com/PulseDevelopmentGroup/GameNight/gql"
	"github.com/PulseDevelopmentGroup/GameNight/gql/resolvers"
)

func main() {
	// Randomize seed
	rand.Seed(time.Now().UnixNano())

	db, err := db.New("127.0.0.1:27017", 10*time.Second, "gamenight")
	if err != nil {
		fmt.Println(err)
	}

	cfg := gql.Config{
		Resolvers: &resolvers.Resolver{db},
	}

	gqlHandler := handler.NewDefaultServer(gql.NewExecutableSchema(cfg)).Handler()
	pgHandler := playground.Handler("GameNight", "/query")

	app := fiber.New()

	app.Use("/query", func(ctx *fiber.Ctx) {
		gqlHandler(ctx.Fasthttp)
	})

	app.Use("/playground", func(ctx *fiber.Ctx) {
		pgHandler(ctx.Fasthttp)
	})

	app.Listen(3000)
}
