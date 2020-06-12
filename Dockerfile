# Build Go App
FROM golang:alpine
RUN apk add --no-cache git gcc g++
WORKDIR /app
COPY server/ .
RUN go build -a -o gamenight .

# Build Node App
FROM node:alpine
WORKDIR /app
COPY client/ .
RUN npm install --production
RUN npm run build

# Build Docker Image
FROM alpine:latest
WORKDIR /app
COPY --from=0 /app/gamenight .
COPY --from=1 /app/build ./public

CMD ./gamenight