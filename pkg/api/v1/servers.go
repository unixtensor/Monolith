package v1

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/unixtensor/monolith/pkg/datastore"
)

type ConnectedJob struct {
	Players datastore.Players
	UpTime  float64
}

func (v1 *V1) games(ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		games, err := v1.DS.GetGames(ctx)
		if err != nil {
			InternalError(gin_ctx, err)
			return
		}

		games_list := []ConnectedGame{}
		for _, game := range games {
			jobs, err := v1.DS.GetJobs(ctx, game.Properties.PlaceId)
			if err != nil {
				InternalError(gin_ctx, err)
				return
			}
			g := ConnectedGame{
				Properties: game.Properties,
				Creator:    game.Creator,
				Jobs:       []string{},
			}
			for _, job := range jobs {
				g.Jobs = append(g.Jobs, job.JobId)
			}
			games_list = append(games_list, g)
		}
		gin_ctx.JSON(http.StatusOK, games_list)
	}
}

func (v1 *V1) servers(ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		placeid := gin_ctx.Param("placeId")

		jobs, err := v1.DS.GetJobs(ctx, placeid)
		if err != nil {
			InternalError(gin_ctx, err)
			return
		}

		jobs_list := map[string]ConnectedJob{}
		for _, job := range jobs {
			plrs, err := v1.DS.GetPlayers(ctx, placeid)
			if err != nil {
				InternalError(gin_ctx, err)
				return
			}
			uptime, err := v1.DS.GetUptime(ctx, job.JobId)
			if err != nil {
				InternalError(gin_ctx, err)
				return
			}
			jobs_list[job.JobId] = ConnectedJob{
				Players: plrs,
				UpTime:  uptime,
			}
		}
		gin_ctx.JSON(http.StatusOK, jobs_list)
	}
}
