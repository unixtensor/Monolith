package v1

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/unixtensor/monolith/pkg/datastore"
)

func (v1 *V1) get_players(ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		jobid := gin_ctx.Param("jobId")

		plrs, err := v1.DS.GetPlayers(ctx, jobid)
		if err != nil {
			InternalError(gin_ctx, err)
			return
		}
		gin_ctx.JSON(http.StatusOK, plrs)
	}
}

func (v1 *V1) insert_players(ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		jobid := gin_ctx.Param("jobId")

		players := make(datastore.Players)
		if err := gin_ctx.ShouldBindJSON(&players); err != nil {
			InternalError(gin_ctx, err)
			return
		}
		if err := v1.DS.InsertPlayers(ctx, jobid, players); err != nil {
			InternalError(gin_ctx, err)
		}
		gin_ctx.Status(http.StatusOK)
	}
}

func (v1 *V1) delete_players(ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		jobid := gin_ctx.Param("jobId")

		players := make(datastore.Players)
		if err := gin_ctx.ShouldBindJSON(&players); err != nil {
			InternalError(gin_ctx, err)
			return
		}
		if err := v1.DS.DeletePlayers(ctx, jobid, players); err != nil {
			InternalError(gin_ctx, err)
		}
		gin_ctx.Status(http.StatusOK)
	}
}
