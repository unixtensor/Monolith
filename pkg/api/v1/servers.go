package v1

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (v1 *V1) games(bg_ctx context.Context) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var cursor uint64
		var keys []string

		batch, cursor, err := v1.Redis.Scan(bg_ctx, cursor, "*", 0).Result()
		if err != nil {
			InternalError(ctx, err)
			return
		}
		for _, v := range batch {
			if v != "jobs" {
				keys = append(keys, v)
			}
		}
		ctx.JSON(http.StatusOK, keys)
	}
}

func (v1 *V1) servers(bg_ctx context.Context) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		batch, err := v1.Redis.SMembers(bg_ctx, "jobs").Result()
		if err != nil {
			InternalError(ctx, err)
			return
		}
		ctx.JSON(http.StatusOK, batch)
	}
}
