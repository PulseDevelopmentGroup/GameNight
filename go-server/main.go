package main

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	goenv "github.com/caarlos0/env/v6"
	"github.com/gofiber/cors"
	"github.com/gofiber/fiber"

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
	HTTPSec  string `env:"GAMENIGHT_HTTP_SECRET" envDefault:"ChangeMe"`

	DBAddr string `env:"GAMENIGHT_DB_ADDR" envDefault:"127.0.0.1"`
	DBPort int    `env:"GAMENIGHT_DB_PORT" envDefault:"27017"`
	DBName string `env:"GAMENIGHT_DB_NAME" envDefault:"gamenight"`
	DBUser string `env:"GAMENIGHT_DB_USER" envDefault:"gamenight"`
	DBPass string `env:"GAMENIGHT_DB_PASS" envDefault:"gamenightpass"`
}

var (
	env = environment{}
)

func main() {
	// Randomize seed
	rand.Seed(time.Now().UnixNano())

	if err := goenv.Parse(&env); err != nil {
		panic(fmt.Errorf("%+v", err))
	}

	logs, err := log.New(env.Debug)
	if err != nil {
		panic(fmt.Errorf("unable to create new loggers: %v", err))
	}
	defer logs.Sync()

	logs.Plain.Info("Connecting to DB")
	db, err := db.New(&db.Config{
		Addr:     env.DBAddr,
		Port:     env.DBPort,
		Context:  context.TODO(),
		Database: env.DBName,
		Username: env.DBUser,
		Password: env.DBPass,
	}, logs.Plain.Named("mongo"))
	if err != nil {
		logs.Plain.Error(
			"Unable to connect to database", zap.NamedError("error", err),
		)
	}
	defer db.Disconnect(context.TODO())

	hub, err := hub.New(db, env.HTTPSec, logs.Plain.Named("hub"))
	if err != nil {
		logs.Plain.Error("Cannot create new hub... this is fatal")
		return
	}

	cfg := gql.Config{
		Resolvers: &resolvers.Resolver{
			Hub: hub,
			DB:  db,
			Log: logs.Plain.Named("graphql"),
		},
	}

	app := fiber.New(&fiber.Settings{
		DisableStartupMessage: true,
	})

	app.Use(cors.New())

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
