#!/bin/bash
printf "\nRegenerating gqlgen files\n"
rm -f gql/generated.go \
    gql/models/generated.go \
    gql/resolvers/schema.resolvers.go
time go run -v github.com/99designs/gqlgen $1
printf "\nDone.  NOTE: The ./gql/resolvers/schema.resolvers.go file WILL need modified after running this script\n\n"