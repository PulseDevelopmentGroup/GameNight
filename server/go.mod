module github.com/PulseDevelopmentGroup/GameNight

go 1.14

require (
	github.com/99designs/gqlgen v0.11.3
	github.com/agnivade/levenshtein v1.1.0 // indirect
	github.com/caarlos0/env/v6 v6.3.0
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/fasthttp/websocket v1.4.3 // indirect
	github.com/gofiber/cors v0.2.1 // indirect
	github.com/gofiber/fiber v1.12.1 // indirect
	github.com/google/uuid v1.1.1 // indirect
	github.com/graphql-go/graphql v0.7.9 // indirect
	github.com/hashicorp/golang-lru v0.5.4 // indirect
	github.com/joho/godotenv v1.3.0 // indirect
	github.com/kisielk/errcheck v1.2.0 // indirect
	github.com/klauspost/compress v1.10.10 // indirect
	github.com/mitchellh/mapstructure v1.3.2 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/savsgio/gotils v0.0.0-20200616100644-13ff1fd2c28c // indirect
	github.com/valyala/fasthttp v1.14.0 // indirect
	github.com/vektah/gqlparser/v2 v2.0.1
	go.mongodb.org/mongo-driver v1.3.5
	go.uber.org/zap v1.15.0
	golang.org/x/crypto v0.0.0-20200709230013-948cd5f35899 // indirect
	golang.org/x/sync v0.0.0-20200625203802-6e8e738ad208 // indirect
)

// Note: This currently works, but it's possible this will break sometime in the
// future
replace github.com/99designs/gqlgen => github.com/arsmn/gqlgen v0.12.0
