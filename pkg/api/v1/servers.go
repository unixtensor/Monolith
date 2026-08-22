package v1

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (v1 *V1) games(ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		games, err := v1.DS.GetGames(ctx)
		if err != nil {
			InternalError(gin_ctx, err)
			return
		}
		games_data := []ConnectedGame{}
		for _, game := range games {
			jobs, err := v1.DS.GetJobs(ctx, game.Properties.PlaceId)
			if err != nil {
				InternalError(gin_ctx, err)
				return
			}
			cg := ConnectedGame{
				Properties: game.Properties,
				Creator:    game.Creator,
				Jobs:       []string{},
			}
			for _, job := range jobs {
				cg.Jobs = append(cg.Jobs, job.JobId)
			}
			games_data = append(games_data, cg)
		}
		gin_ctx.JSON(http.StatusOK, games_data)
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
