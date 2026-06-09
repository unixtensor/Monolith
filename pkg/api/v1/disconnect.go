package v1

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (v1 *V1) disconnect_job(ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		jobid := gin_ctx.Param("jobId")

		if del_job_err := v1.DS.DeleteJob(ctx, jobid); del_job_err != nil {
			InternalError(gin_ctx, del_job_err)
			return
		}
		gin_ctx.Status(http.StatusOK)
	}
}

func (v1 *V1) disconnect_game(ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		placeid := gin_ctx.Param("placeId")

		if del_game_err := v1.DS.DeleteGame(ctx, placeid); del_game_err != nil {
			InternalError(gin_ctx, del_game_err)
			return
		}
		gin_ctx.Status(http.StatusOK)
	}
}
