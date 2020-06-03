module github.com/PulseDevelopmentGroup/GameNight

go 1.14

require (
	github.com/99designs/gqlgen v0.11.3
	github.com/gofiber/fiber v1.10.3
	github.com/graphql-go/graphql v0.7.9
	github.com/hashicorp/golang-lru v0.5.4 // indirect
	github.com/klauspost/compress v1.10.7 // indirect
	github.com/mitchellh/mapstructure v1.3.1 // indirect
	github.com/pkg/errors v0.9.1 // indirect
	github.com/savsgio/gotils v0.0.0-20200413113635-8c468ce75cca // indirect
	github.com/valyala/fasthttp v1.14.0 // indirect
	github.com/vektah/gqlparser/v2 v2.0.1
	go.mongodb.org/mongo-driver v1.3.3
	golang.org/x/crypto v0.0.0-20200602180216-279210d13fed // indirect
	golang.org/x/sync v0.0.0-20200317015054-43a5402ce75a // indirect
)

// Note: This currently works, but it's possible this will break sometime in the
// future
replace github.com/99designs/gqlgen => github.com/arsmn/gqlgen v0.12.0
