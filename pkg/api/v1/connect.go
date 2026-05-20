package v1

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

type Players = map[string]uint

type Metadata struct {
	Name       string `json:"Name" binding:"required"`
	CreatorId  uint   `json:"CreatorId" binding:"required"`
	MaxPlayers uint   `json:"MaxPlayers" binding:"required"`
}
type Game struct {
	Game    Metadata `json:"Game" binding:"required"`
	Players Players  `json:"Players" binding:"required"`
}

func (g *Game) insert_redis_plrs(r *redis.Client, bg_ctx context.Context, place_id string, plrs Players) error {
	json, err := json.Marshal(plrs)
	if err != nil {
		return err
	}
	return r.Set(bg_ctx, place_id+".players", json, 0).Err()
}

func (g *Game) insert_redis(r *redis.Client, bg_ctx context.Context, place_id, job_id string) error {
	get_err := r.JSONGet(bg_ctx, place_id, "$").Err()
	if get_err == redis.Nil {
		if set_err := r.JSONSetMode(bg_ctx, place_id, "$", g.Game, "NX").Err(); set_err != nil {
			return set_err
		}
	} else if get_err != nil {
		return get_err
	}
	if add_plrs_err := g.insert_redis_plrs(r, bg_ctx, place_id, g.Players); add_plrs_err != nil {
		return add_plrs_err
	}
	return r.SAdd(bg_ctx, "jobs", job_id).Err()
}

func (v1 *V1) connect(bg_ctx context.Context) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		place_id := ctx.Param("placeId")
		job_id := ctx.Param("jobId")

		var game = Game{}
		if game_metadata_err := ctx.ShouldBindJSON(&game); game_metadata_err != nil {
			InternalError(ctx, game_metadata_err)
			return
		}
		if added_err := game.insert_redis(v1.Redis, bg_ctx, place_id, job_id); added_err != nil {
			InternalError(ctx, added_err)
			return
		}
		ctx.Status(http.StatusOK)
	}
}

func (v1 *V1) connected(bg_ctx context.Context) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		place_id := ctx.Param("placeId")

		exists, err := v1.Redis.JSONGet(bg_ctx, place_id, "$").Result()
		if err != nil {
			InternalError(ctx, err)
			return
		}
		var as_json []json.RawMessage
		if err := json.Unmarshal([]byte(exists), &as_json); err != nil {
			InternalError(ctx, err)
			return
		}
		ctx.JSON(http.StatusOK, as_json)
	}
}
