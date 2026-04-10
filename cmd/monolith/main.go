package main

import (
	"log"
	"os"
	"regexp"

	"github.com/unixtensor/monolith/pkg/api"
)

func main() {
	port, port_set := os.LookupEnv("PORT")
	_, debug_set := os.LookupEnv("DEBUG")
	token, token_set := os.LookupEnv("TOKEN")

	if !token_set {
		log.Fatal("Environment variable: TOKEN is not set, STOPPING.")
	}
	if !regexp.MustCompile(`^[a-zA-Z0-9]+$`).MatchString(token) {
		log.Fatalf("TOKEN must only contain letters and numbers, STOPPING.")
	}
	if !port_set {
		port = "3000"
		log.Println("Environment variable PORT is not set, DEFAULTING to 3000.")
	}

	api_v1 := api.Config{
		Port:  port,
		Token: token,
		Debug: debug_set,
	}
	api_v1.Start()
}
