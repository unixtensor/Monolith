package v1

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (v1 *V1) insert_uptime(ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		jobid := gin_ctx.Param("jobId")

		var uptime float64
		if err := gin_ctx.ShouldBindJSON(&uptime); err != nil {
			InternalError(gin_ctx, err)
			return
		}
		if del_job_err := v1.DS.InsertUptime(ctx, jobid, uptime); del_job_err != nil {
			InternalError(gin_ctx, del_job_err)
			return
		}
		gin_ctx.Status(http.StatusOK)
	}
}

func (v1 *V1) get_uptime(ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		jobid := gin_ctx.Param("jobId")

		u, err := v1.DS.GetUptime(ctx, jobid)
		if err != nil {
			InternalError(gin_ctx, err)
			return
		}
		gin_ctx.JSON(http.StatusOK, u)
	}
}
