package v1

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (v1 *V1) get_uptime(ctx context.Context) gin.HandlerFunc {
	return func(gin_ctx *gin.Context) {
		jobid := gin_ctx.Param("jobId")

		u, err := v1.DS.GetJobCreation(ctx, jobid)
		if err != nil {
			InternalError(gin_ctx, err)
			return
		}
		gin_ctx.JSON(http.StatusOK, u)
	}
}
