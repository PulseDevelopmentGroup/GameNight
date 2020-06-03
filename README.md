# GameNight

## Server Notes

### Development

After updating the schema or anything in the `server/models` folder, the 
`server/updateschema.sh` script must be run. After running the script, the 
`server/gql/resolvers/schema.resolvers.go` file must be updated, removing any
functions already defined in the `server/gql/resolvers/resolver.go` file.

### TODO

- [ ] More configuration options for database timeouts (instead of hard-coding)
- [ ] Implement Proper Logging
- [ ] Make API errors less verbose
