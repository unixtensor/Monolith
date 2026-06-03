package v1

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Metadata struct {
	Name       string `json:"Name" binding:"required"`
	CreatorId  uint   `json:"CreatorId" binding:"required"`
	MaxPlayers uint   `json:"MaxPlayers" binding:"required"`
}
type Game struct {
	Game    Metadata        `json:"Game" binding:"required"`
	Players map[string]uint `json:"Players" binding:"required"`
}

func (v1 *V1) connect(bg_ctx context.Context) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		place_id := ctx.Param("placeId")
		job_id := ctx.Param("jobId")

		var g = Game{}
		if game_err := ctx.ShouldBindJSON(&g); game_err != nil {
			InternalError(ctx, game_err)
			return
		}
		if _, db_err := v1.DS.GetGame(bg_ctx, place_id); db_err != nil {
			InternalError(ctx, db_err)
			return
		}
		ctx.Status(http.StatusOK)
	}
}

func (v1 *V1) connected(bg_ctx context.Context) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		place_id := ctx.Param("placeId")

		exists, err := v1.Redis.JSONGet(bg_ctx, place_id, "$").Result()
		println(exists)
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
