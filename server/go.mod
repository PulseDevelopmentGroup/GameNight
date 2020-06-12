module github.com/PulseDevelopmentGroup/GameNight

go 1.14

require (
	github.com/99designs/gqlgen v0.11.3
	github.com/caarlos0/env/v6 v6.2.2
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/fasthttp/websocket v1.4.3 // indirect
	github.com/gofiber/fiber v1.11.1
	github.com/google/uuid v1.1.1 // indirect
	github.com/graphql-go/graphql v0.7.9
	github.com/hashicorp/golang-lru v0.5.4 // indirect
	github.com/joho/godotenv v1.3.0
	github.com/klauspost/compress v1.10.8 // indirect
	github.com/mitchellh/mapstructure v1.3.2 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/valyala/fasthttp v1.14.0 // indirect
	github.com/vektah/gqlparser/v2 v2.0.1
	go.mongodb.org/mongo-driver v1.3.4
	go.uber.org/zap v1.15.0
	golang.org/x/crypto v0.0.0-20200604202706-70a84ac30bf9 // indirect
	golang.org/x/sync v0.0.0-20200317015054-43a5402ce75a // indirect
)

// Note: This currently works, but it's possible this will break sometime in the
// future
replace github.com/99designs/gqlgen => github.com/arsmn/gqlgen v0.12.0
