# GameNight - Server

## Development

After updating the schema or anything in the `server/models` folder, the 
`server/updateschema.sh` script must be run. After running the script, the 
`server/gql/resolvers/schema.resolvers.go` file must be updated, removing any
functions already defined in the `server/gql/resolvers/resolver.go` file.