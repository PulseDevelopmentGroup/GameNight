FROM golang:alpine
RUN apk add --no-cache git gcc g++
RUN go get github.com/cespare/reflex
RUN echo "hosts: files dns" > /etc/nsswitch.conf
COPY reflex.conf /
ENTRYPOINT ["reflex", "-c", "/reflex.conf"]