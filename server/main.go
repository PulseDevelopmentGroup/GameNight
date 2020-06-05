package main

import (
	"context"
	"fmt"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	goenv "github.com/caarlos0/env/v6"
	"github.com/gofiber/fiber"
	_ "github.com/joho/godotenv/autoload"
	"go.uber.org/zap"

	"github.com/PulseDevelopmentGroup/GameNight/db"
	"github.com/PulseDevelopmentGroup/GameNight/gql"
	"github.com/PulseDevelopmentGroup/GameNight/gql/resolvers"
	"github.com/PulseDevelopmentGroup/GameNight/hub"
	"github.com/PulseDevelopmentGroup/GameNight/log"
)

type environment struct {
	Debug bool `env:"GAMENIGHT_DEBUG" envDefault:"false"`

	HTTPAddr string `env:"GAMENIGHT_HTTP_ADDR" envDefault:"0.0.0.0"`
	HTTPPort int    `env:"GAMENIGHT_HTTP_PORT" envDefault:"80"`
	HTTPDir  string `env:"GAMENIGHT_HTTP_DIR" envDefault:"public/"`

	DBAddr string `env:"GAMENIGHT_DB_ADDR" envDefault:"127.0.0.1"`
	DBPort int    `env:"GAMENIGHT_DB_PORT" envDefault:"27017"`
	DBName string `env:"GAMENIGHT_DB_NAME" envDefault:"gamenight"`
}

var (
	env = environment{}
)

func main() {
	// Randomize seed
	//rand.Seed(time.Now().UnixNano())

	if err := goenv.Parse(&env); err != nil {
		panic(fmt.Errorf("%+v", err))
	}

	logs, err := log.New(env.Debug)
	if err != nil {
		panic(fmt.Errorf("Unable to create new loggers: %v", err))
	}
	defer logs.Sync()

	logs.Plain.Info("Connecting to DB")
	db, err := db.New(&db.Config{
		Addr:     "127.0.0.1",
		Port:     27017,
		Context:  context.TODO(),
		Database: "gamenight",
	}, logs.Plain.Named("mongo"))
	if err != nil {
		logs.Plain.Error(
			"Unable to connect to database", zap.NamedError("error", err),
		)
	}
	defer db.Disconnect(context.TODO())

	cfg := gql.Config{
		Resolvers: &resolvers.Resolver{
			Hub: hub.New(db, logs.Plain.Named("hub")),
			DB:  db,
			Log: logs.Plain.Named("graphql"),
		},
	}

	app := fiber.New(&fiber.Settings{
		DisableStartupMessage: true,
	})

	app.Use("/query", func(ctx *fiber.Ctx) {
		handler.NewDefaultServer(gql.NewExecutableSchema(cfg)).Handler()(ctx.Fasthttp)
	})

	if env.Debug {
		app.Use("/playground", func(ctx *fiber.Ctx) {
			playground.Handler("GameNight", "/query")(ctx.Fasthttp)
		})
	}

	app.Static("/", env.HTTPDir)

	listen := fmt.Sprintf("%s:%d", env.HTTPAddr, env.HTTPPort)
	logs.Sugar.Infof("Listening for requests at %s", listen)

	app.Listen(listen)
}
