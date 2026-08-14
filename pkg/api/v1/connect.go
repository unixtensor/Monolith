package v1

import (
	"context"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/unixtensor/monolith/pkg/datastore"
	"gorm.io/gorm"
)

type ConnectedGame struct {
	datastore.Game
	jobs []string
}

func add_game(v1 *V1, bg_ctx context.Context, gin_ctx *gin.Context, placeid, jobid string) error {
	g := datastore.Game{
		Properties: datastore.GameDetails{PlaceId: placeid},
	}
	j := datastore.Job{
		JobId:   jobid,
		PlaceId: placeid,
	}
	if game_json_err := gin_ctx.ShouldBindJSON(&g); game_json_err != nil {
		return game_json_err
	}
	if db_set_g_err := v1.DS.InsertGame(bg_ctx, g); db_set_g_err != nil {
		return db_set_g_err
	}
	return v1.DS.InsertJob(bg_ctx, j)
}

func (v1 *V1) connect(bg_ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		placeid := gin_ctx.Param("placeId")
		jobid := gin_ctx.Param("jobId")

		if err := add_game(v1, bg_ctx, gin_ctx, placeid, jobid); err != nil {
			InternalError(gin_ctx, err)
			return
		}
		gin_ctx.Status(http.StatusOK)
	}
}

func (v1 *V1) connected(bg_ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		placeid := gin_ctx.Param("placeId")

		game, game_err := v1.DS.GetGame(bg_ctx, placeid)
		println(game, game_err)
		if errors.Is(game_err, gorm.ErrRecordNotFound) {
			gin_ctx.JSON(http.StatusOK, nil)
			return
		}
		if game_err != nil {
			InternalError(gin_ctx, game_err)
			return
		}
		jobs, jobs_err := v1.DS.GetJobs(bg_ctx, placeid)
		if jobs_err != nil {
			InternalError(gin_ctx, game_err)
			return
		}

		game_data := ConnectedGame{jobs: []string{}}
		game_data.Properties = game.Properties
		game_data.Creator = game.Creator
		for _, job := range jobs {
			game_data.jobs = append(game_data.jobs, job.JobId)
		}
		gin_ctx.JSON(http.StatusOK, game_data.DeletedAt)
	}
}
