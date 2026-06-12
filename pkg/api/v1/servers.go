package v1

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (v1 *V1) games(ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		g, err := v1.DS.GetGames(ctx)
		if err != nil {
			InternalError(gin_ctx, err)
			return
		}
		gin_ctx.JSON(http.StatusOK, g)
	}
}

func (v1 *V1) servers(ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		placeid := gin_ctx.Param("placeId")

		j, err := v1.DS.GetJobs(ctx, placeid)
		if err != nil {
			InternalError(gin_ctx, err)
			return
		}
		gin_ctx.JSON(http.StatusOK, j)
	}
}
