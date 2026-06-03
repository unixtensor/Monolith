package main

import (
	"context"
	"errors"
	"log"
	"os"
	"regexp"

	"github.com/unixtensor/monolith/pkg/api"
	"github.com/unixtensor/monolith/pkg/datastore"
)

const (
	DEFAULT_PORT            = "3000"
	DEFAULT_REDIS_ADDR      = "redis:6379"
	DEFAULT_POSTGRES_DOMAIN = "postgres"
	DEFAULT_POSTGRES_PORT   = "5432"
)

type settings struct {
	pg_password,
	pg_port,
	pg,
	redis,
	port,
	token string
	debug bool
}

func env() (settings, error) {
	postgres_domain, postgres_domain_set := os.LookupEnv("POSTGRES")
	postgres_port, postgres_port_set := os.LookupEnv("POSTGRES_PORT")
	postgres_pass, postgres_pass_set := os.LookupEnv("POSTGRES_PASSWORD")
	redis_addr, redis_addr_set := os.LookupEnv("REDIS")
	token, token_set := os.LookupEnv("TOKEN")
	port, port_set := os.LookupEnv("PORT")
	_, debug_set := os.LookupEnv("DEBUG")

	if !postgres_pass_set {
		return settings{}, errors.New("POSTGRES_PASSWORD is not set.")
	}
	if !token_set {
		return settings{}, errors.New("TOKEN is not set.")
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
	if !postgres_domain_set {
		postgres_domain = DEFAULT_POSTGRES_DOMAIN
	}
	if !postgres_port_set {
		postgres_port = DEFAULT_POSTGRES_PORT
	}

	return settings{
		pg_password: postgres_pass,
		pg_port:     postgres_port,
		pg:          postgres_domain,
		redis:       redis_addr,
		port:        port,
		token:       token,
		debug:       debug_set,
	}, nil
}

func main() {
	server_settings, server_settings_err := env()
	if server_settings_err != nil {
		log.Fatalf("%s", server_settings_err.Error())
	}
	ds, ds_err := datastore.NewDS(datastore.DsSettings{
		Redis_addr: server_settings.redis,
		Pg_addr:    server_settings.pg,
		Pg_port:    server_settings.pg_port,
		Pg_passwd:  server_settings.pg_password,
	})
	if ds_err != nil {
		log.Fatalf("%s", ds_err.Error())
	}
	api_root := api.Api{
		Port:  server_settings.port,
		Token: server_settings.token,
		Debug: server_settings.debug,
		DS:    ds,
	}
	api_root.V1(context.Background())
}
