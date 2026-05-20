package main

import (
	"context"
	"errors"
	"log"
	"os"
	"regexp"

	"github.com/redis/go-redis/v9"
	"github.com/unixtensor/monolith/pkg/api"
)

const (
	DEFAULT_PORT       = "3000"
	DEFAULT_REDIS_ADDR = "redis:6379"
)

type settings struct {
	redis string
	port  string
	token string
	debug bool
}

func env() (settings, error) {
	redis_addr, redis_addr_set := os.LookupEnv("REDIS")
	token, token_set := os.LookupEnv("TOKEN")
	port, port_set := os.LookupEnv("PORT")
	_, debug_set := os.LookupEnv("DEBUG")

	if !token_set {
		return settings{}, errors.New("Environment variable: TOKEN is not set.")
	}
	if !regexp.MustCompile(`^[a-zA-Z0-9]+$`).MatchString(token) {
		return settings{}, errors.New("TOKEN must only contain letters and numbers.")
	}
	if !port_set {
		port = DEFAULT_PORT
	}
	if !redis_addr_set {
		redis_addr = DEFAULT_REDIS_ADDR
	}
	return settings{
		redis: redis_addr,
		port:  port,
		token: token,
		debug: debug_set,
	}, nil
}

func main() {
	server_settings, server_settings_err := env()
	if server_settings_err != nil {
		log.Fatalf("%s", server_settings_err.Error())
	}

	bg_ctx := context.Background()
	Redis := redis.NewClient(&redis.Options{Addr: server_settings.redis})
	defer Redis.Close()

	api_root := api.Api{
		Port:  server_settings.port,
		Token: server_settings.token,
		Debug: server_settings.debug,
		Redis: Redis,
	}
	api_root.V1(bg_ctx)
}
