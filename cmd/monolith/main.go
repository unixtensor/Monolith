package main

import (
	"log"
	"os"

	"github.com/unixtensor/monolith/pkg/api"
)

const PROMPT_PADDING = "\n-*-*-*-*-*-*-*-*-*-*-"

func main() {
	port, port_set := os.LookupEnv("PORT")
	_, debugging_set := os.LookupEnv("DEBUG")
	secret, secret_set := os.LookupEnv("SECRET")

	if !secret_set {
		log.Fatal("Environment variable: SECRET is not set, STOPPING." + PROMPT_PADDING)
	}
	if !port_set {
		port = "3000"
		log.Println("Environment variable PORT is not set, DEFAULTING to 3000.")
	}

	api.Start(&api.Config{
		Port:      port,
		Secret:    secret,
		Debugging: debugging_set,
	})
}
