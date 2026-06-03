package datastore

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"

	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Datastore struct {
	pg    *gorm.DB
	redis *Redis
}
type DsSettings struct {
	Redis_addr, Pg_addr, Pg_port, Pg_passwd string
}
type Game struct {
	PlaceId,
	CreatorId uint64
	Name       string
	MaxPlayers uint
}
type Job struct {
	JobID   string
	Players map[string]uint64 `gorm:"-"`
}
type PgGame struct {
	gorm.Model
	Game
}
type PgJob struct {
	gorm.Model
	Job
}
type PgPlayer struct {
	gorm.Model
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
	return &Datastore{db, redis_open(s.Redis_addr)}, db.AutoMigrate(&PgGame{}, &PgJob{})
}

func (ds *Datastore) InsertGame(ctx context.Context, game Game) error {
	if db_cr_err := ds.pg.Create(&PgGame{Game: game}).Error; db_cr_err != nil {
		return db_cr_err
	}
	return ds.redis.SetMarshel(ctx, strconv.Itoa(int(game.PlaceId)), game)
}

func (ds *Datastore) InsertJob(ctx context.Context, job Job) error {
	if db_err := ds.pg.Create(&PgJob{Job: job}).Error; db_err != nil {
		return db_err
	}
	return ds.redis.SetMarshel(ctx, job.JobID, job)
}

func (ds *Datastore) GetGame(ctx context.Context, placeid uint64) (Game, error) {
	var g Game
	c_hit, err := ds.redis.Get(ctx, strconv.Itoa(int(placeid))).Result()
	if errors.Is(err, redis.Nil) {
		err := ds.pg.Where("PlaceId = ?", placeid).First(&g).Error
		return g, err
	}
	if j_err := json.Unmarshal([]byte(c_hit), &g); j_err != nil {
		return g, nil
	}
	return g, err
}

func (ds *Datastore) GetGameMarshal(ctx context.Context, placeid uint64) (string, error) {
	c_hit, err := ds.redis.Get(ctx, strconv.Itoa(int(placeid))).Result()
	if errors.Is(err, redis.Nil) {
		var g Game
		if err := ds.pg.Where("PlaceId = ?", placeid).First(&g).Error; err != nil {
			return "", err
		}
		j, j_err := json.Marshal(g)
		return string(j), j_err
	}
	return c_hit, err
}

func (ds *Datastore) DeleteGame(ctx context.Context, placeid uint64) error {
	if db_err := ds.pg.Where("PlaceId = ?", placeid).Delete(&Game{}).Error; db_err != nil {
		return db_err
	}
	return ds.redis.Del(ctx, strconv.Itoa(int(placeid))).Err()
}

func (ds *Datastore) DeleteJob(ctx context.Context, jobid string) error {
	if db_err := ds.pg.Unscoped().Where("JobID = ?", jobid).Delete(&Job{}).Error; db_err != nil {
		return db_err
	}
	return ds.redis.Del(ctx, jobid).Err()
}
