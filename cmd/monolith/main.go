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
	token, token_set := os.LookupEnv("TOKEN")

	if !token_set {
		log.Fatal("Environment variable: TOKEN is not set, STOPPING." + PROMPT_PADDING)
	}
	if !port_set {
		port = "3000"
		log.Println("Environment variable PORT is not set, DEFAULTING to 3000." + PROMPT_PADDING)
	}

	api.Start(&api.Config{
		Port:      port,
		Token:     token,
		Debugging: debugging_set,
	})
}
