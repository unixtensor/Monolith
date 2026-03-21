package game

import "github.com/gin-gonic/gin"

type gzip []byte

type instance struct {
	Compressed bool
	InnerGzip  gzip
	Inner      gin.H
}

type Game struct {
	Metadata GameMetadata
	Instance instance
}

type GameMetadata struct {
	CreatorId int    `json:"CreatorId"`
	Id        int    `json:"Id"`
	Name      string `json:"Name"`
}

var Current Game

func Connected() bool {
	return Current.Metadata.Id != 0
}

func Disconnect() {
	Current = Game{}
}
