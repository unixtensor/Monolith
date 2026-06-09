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
type Game struct {
	gorm.Model
	PlaceId    string
	Name       string `json:"Name" binding:"required"`
	CreatorId  uint64 `json:"CreatorId" binding:"required"`
	MaxPlayers uint   `json:"MaxPlayers" binding:"required"`
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
