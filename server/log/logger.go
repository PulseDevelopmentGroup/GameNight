package log

import (
	"go.uber.org/zap"
)

type Logs struct {
	Plain *zap.Logger
	Sugar *zap.SugaredLogger
}

func New(debug bool) (*Logs, error) {

	// TODO: Fix custom logging config so it actually works
	/*
		level := zap.ErrorLevel
		encoding := "json"
		if debug {
			level = zap.InfoLevel
			encoding = "console"
		}

		cfg := &zap.Config{
			Level:             zap.NewAtomicLevelAt(level),
			Development:       debug,
			DisableCaller:     !debug,
			DisableStacktrace: !debug,
			Encoding:          encoding,
			OutputPaths:       []string{"stdout"},
		}

		logger, err := cfg.Build()
		if err != nil {
			return &Logs{}, err
		}
	*/

	// TODO: Surely there is an easier way to handle this logic...
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

func (l *Logs) Sync() {
	l.Plain.Sync()
	l.Sugar.Sync()
}
