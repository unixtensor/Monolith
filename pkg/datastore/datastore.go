package datastore

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Players map[string]uint64

type Datastore struct {
	pg    *gorm.DB
	redis *Redis
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
	JobId   string
	PlaceId string
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
	return &Datastore{db, redis_open(s.Redis_addr)}, db.AutoMigrate(&Game{}, &Job{})
}

func get_db[T any](ctx context.Context, ds *Datastore, k string, db_query func(*T) error) (T, error) {
	var r T
	c_hit, c_err := ds.redis.Get(ctx, k).Result()
	if errors.Is(c_err, redis.Nil) {
		return r, db_query(&r)
	}
	if c_err != nil {
		return r, c_err
	}
	if j_err := json.Unmarshal([]byte(c_hit), &r); j_err != nil {
		return r, j_err
	}
	return r, nil
}

func get_db_marshal[T any](ctx context.Context, ds *Datastore, k string, db_query func(*T) error) (string, error) {
	c_hit, c_err := ds.redis.Get(ctx, k).Result()
	if errors.Is(c_err, redis.Nil) {
		var r T
		if err := db_query(&r); err != nil {
			return "", err
		}
		j, j_err := json.Marshal(r)
		return string(j), j_err
	}
	return c_hit, c_err
}

func (ds *Datastore) InsertGameDB(ctx context.Context, game Game) error {
	if db_cr_err := ds.pg.Create(&game).Error; db_cr_err != nil {
		return db_cr_err
	}
	return ds.redis.SetMarshel(ctx, game.PlaceId, game)
}

func (ds *Datastore) InsertJobDB(ctx context.Context, job Job) error {
	if db_err := ds.pg.Create(&job).Error; db_err != nil {
		return db_err
	}
	return ds.redis.SetMarshel(ctx, job.JobId, job)
}

func (ds *Datastore) InsertGame(ctx context.Context, game Game) error {
	_, db_err := ds.GetGame(ctx, game.PlaceId)
	if errors.Is(db_err, gorm.ErrRecordNotFound) {
		if set_err := ds.InsertGameDB(ctx, game); set_err != nil {
			return set_err
		}
	}
	return db_err
}

func (ds *Datastore) InsertJob(ctx context.Context, job Job) error {
	_, db_err := ds.GetJob(ctx, job.JobId)
	if errors.Is(db_err, gorm.ErrRecordNotFound) {
		if set_err := ds.InsertJobDB(ctx, job); set_err != nil {
			return set_err
		}
	}
	return db_err
}

func (ds *Datastore) GetGame(ctx context.Context, placeid string) (Game, error) {
	return get_db(ctx, ds, placeid, func(g *Game) error {
		return ds.pg.Where("place_id = ?", placeid).First(g).Error
	})
}

func (ds *Datastore) GetGameMarshal(ctx context.Context, placeid string) (string, error) {
	return get_db_marshal(ctx, ds, placeid, func(g *Game) error {
		return ds.pg.Where("place_id = ?", placeid).First(g).Error
	})
}

func (ds *Datastore) GetJob(ctx context.Context, jobid string) (Job, error) {
	return get_db(ctx, ds, jobid, func(j *Job) error {
		return ds.pg.Where("job_id = ?", jobid).First(j).Error
	})
}

func (ds *Datastore) GetJobMarshal(ctx context.Context, jobid string) (string, error) {
	return get_db_marshal(ctx, ds, jobid, func(g *Game) error {
		return ds.pg.Where("job_id = ?", jobid).First(g).Error
	})
}

func (ds *Datastore) DeleteGame(ctx context.Context, placeid string) error {
	if db_err := ds.pg.Where("place_id = ?", placeid).Delete(&Game{}).Error; db_err != nil {
		return db_err
	}
	return ds.redis.Del(ctx, placeid).Err()
}

func (ds *Datastore) DeleteJob(ctx context.Context, jobid string) error {
	if db_err := ds.pg.Unscoped().Where("job_id = ?", jobid).Delete(&Job{}).Error; db_err != nil {
		return db_err
	}
	return ds.redis.Del(ctx, jobid).Err()
}
