package log

import (
	"go.uber.org/zap"
)

// Logs defines the plain and sugared loggers within the log package.
// Plain is used for simple log messages favoring performance, sugar is used
// for rich log messages that need to have some sort of structured element.
type Logs struct {
	Plain *zap.Logger
	Sugar *zap.SugaredLogger
}

// New creates new loggers. A debug boolean can be passed to indicate what type
// of loggers to create.
func New(debug bool) (*Logs, error) {
	logger, err := zap.NewProduction()
	if err != nil {
		return &Logs{}, err
	}

	if debug {
		logger, err = zap.NewDevelopment()
		if err != nil {
			return &Logs{}, err
		}
	}

	return &Logs{
		Plain: logger.Named("main"),
		Sugar: logger.Named("main").Sugar(),
	}, nil
}

// Sync flushes the logs and writes them to their outputs.
func (l *Logs) Sync() {
	l.Plain.Sync()
	l.Sugar.Sync()
}
