package datastore

import (
	"context"
	"encoding/json"
	"time"

	"github.com/redis/go-redis/v9"
)

const (
	TTL_INSERTS = time.Hour
)

type Redis struct {
	*redis.Client
}

func redis_open(addr string) *Redis {
	return &Redis{redis.NewClient(&redis.Options{Addr: addr})}
}

func (r *Redis) SetMarshel(ctx context.Context, key string, v any) error {
	j, err := json.Marshal(v)
	if err != nil {
		return err
	}
	return r.Set(ctx, key, j, TTL_INSERTS).Err()
}
