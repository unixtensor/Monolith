package datastore

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

const TTL_INSERTS = time.Hour

func set_marshel_cache(ctx context.Context, r *redis.Client, key string, v any) error {
	j, err := json.Marshal(v)
	if err != nil {
		return err
	}
	return r.Set(ctx, key, j, TTL_INSERTS).Err()
}

func (ds *Datastore) InsertGameDB(ctx context.Context, game Game) error {
	if db_cr_err := ds.pg.Create(&game).Error; db_cr_err != nil {
		return db_cr_err
	}
	return set_marshel_cache(ctx, ds.redis, game.PlaceId, game)
}

func (ds *Datastore) InsertJobDB(ctx context.Context, job Job) error {
	if db_err := ds.pg.Create(&job).Error; db_err != nil {
		return db_err
	}
	return set_marshel_cache(ctx, ds.redis, job.JobId, job)
}

func (ds *Datastore) InsertGame(ctx context.Context, game Game) error {
	_, db_err := ds.GetGame(ctx, game.PlaceId)
	if errors.Is(db_err, gorm.ErrRecordNotFound) {
		return ds.InsertGameDB(ctx, game)
	}
	return db_err
}

func (ds *Datastore) InsertJob(ctx context.Context, job Job) error {
	_, db_err := ds.GetJob(ctx, job.JobId)
	if errors.Is(db_err, gorm.ErrRecordNotFound) {
		return ds.InsertJobDB(ctx, job)
	}
	return db_err
}

func (ds *Datastore) InsertPlayers(ctx context.Context, jobid string, players Players) error {
	for id, name := range players {
		if id_s_err := ds.redis.SAdd(ctx, jobid+":players", id+":"+name).Err(); id_s_err != nil {
			return id_s_err
		}
	}
	return nil
}
