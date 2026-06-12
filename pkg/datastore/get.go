package datastore

import (
	"context"
	"encoding/json"
	"errors"
	"strings"

	"github.com/redis/go-redis/v9"
)

func get_db[T Game | Job](ctx context.Context, redis_c *redis.Client, k string, db_query func(*T) error) (T, error) {
	var r T
	c_hit, c_err := redis_c.Get(ctx, k).Result()
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

func get_db_marshal[T Game | Job](ctx context.Context, redis_c *redis.Client, k string, db_query func(*T) error) (string, error) {
	c_hit, c_err := redis_c.Get(ctx, k).Result()
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

func (ds *Datastore) GetGame(ctx context.Context, placeid string) (Game, error) {
	return get_db(ctx, ds.redis, GAME_KEY+placeid, func(g *Game) error {
		return ds.pg.Where("place_id = ?", placeid).First(g).Error
	})
}

func (ds *Datastore) GetGameMarshal(ctx context.Context, placeid string) (string, error) {
	return get_db_marshal(ctx, ds.redis, GAME_KEY+placeid, func(g *Game) error {
		return ds.pg.Where("place_id = ?", placeid).First(g).Error
	})
}

func (ds *Datastore) GetGames(ctx context.Context) ([]Game, error) {
	var games []Game
	return games, ds.pg.WithContext(ctx).Find(&games).Error
}

func (ds *Datastore) GetJob(ctx context.Context, jobid string) (Job, error) {
	return get_db(ctx, ds.redis, jobid, func(j *Job) error {
		return ds.pg.Where("job_id = ?", jobid).First(j).Error
	})
}

func (ds *Datastore) GetJobMarshal(ctx context.Context, jobid string) (string, error) {
	return get_db_marshal(ctx, ds.redis, jobid, func(g *Game) error {
		return ds.pg.Where("job_id = ?", jobid).First(g).Error
	})
}

func (ds *Datastore) GetJobs(ctx context.Context, placeid string) ([]Job, error) {
	var jobs []Job
	return jobs, ds.pg.Where("place_id = ?", placeid).Find(&jobs).Error
}

func (ds *Datastore) GetPlayers(ctx context.Context, jobid string) (Players, error) {
	plrs := make(Players)
	r_plrs, err := ds.redis.SMembers(ctx, jobid+":players").Result()
	if err != nil {
		return plrs, err
	}
	for _, id_name := range r_plrs {
		id, name, ok := strings.Cut(id_name, ":")
		if !ok {
			return plrs, errors.New("sep \":\" did not appear in: " + id_name)
		}
		plrs[id] = name
	}
	return plrs, nil
}
