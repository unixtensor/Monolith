package datastore

import (
	"fmt"

	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Players map[string]string

type Datastore struct {
	pg    *gorm.DB
	redis *redis.Client
}
type DsSettings struct {
	Redis_addr, Pg_addr, Pg_port, Pg_passwd string
}

type GameDetails struct {
	PlaceId     string
	Name        string `json:"Name"`
	Created     string `json:"Created"`
	Updated     string `json:"Updated"`
	MaxPlayers  uint   `json:"MaxPlayers"`
	Description string `json:"Description"`
}
type GameCreatorDetails struct {
	Id   uint64 `json:"Id"`
	Name string `json:"Name"`
}
type Game struct {
	gorm.Model
	Properties GameDetails        `json:"Properties" binding:"required"`
	Creator    GameCreatorDetails `json:"Creator" binding:"required"`
}
type Job struct {
	gorm.Model
	JobId, PlaceId string
}

func NewDS(s DsSettings) (*Datastore, error) {
	db, db_err := gorm.Open(
		postgres.Open(
			fmt.Sprintf("host=%s user=monolith password=%s dbname=monolith port=%s sslmode=disable", s.Pg_addr, s.Pg_passwd, s.Pg_port),
		),
		&gorm.Config{},
	)
	if db_err != nil {
		return &Datastore{}, db_err
	}
	return &Datastore{
		db,
		redis.NewClient(&redis.Options{Addr: s.Redis_addr}),
	}, db.AutoMigrate(&Game{}, &Job{})
}
