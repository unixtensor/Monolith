package v1

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/unixtensor/monolith/pkg/datastore"
)

type V1 struct {
	Token string
	DS    *datastore.Datastore
}

func root(ctx *gin.Context) {
	ctx.Status(http.StatusOK)
}

func InternalError(ctx *gin.Context, err error) {
	ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
}

func (v1 *V1) V1(bg_ctx context.Context, port string, gin *gin.Engine) error {
	api_v1_group := gin.Group("/api/v1")
	{
		api_v1_group.POST("/", v1.login)
		api_v1_group.POST("/logout", v1.logout)
		api_v1_group.Use(v1.verify_token())
		{
			api_v1_group.GET("/", root)
			api_v1_group.GET("/games", v1.games(bg_ctx))
			api_v1_group.GET(":placeId", v1.connected(bg_ctx))
			api_v1_group.GET(":placeId/jobs", v1.servers(bg_ctx))
			api_v1_group.POST(":placeId/:jobId", v1.connect(bg_ctx))
			api_v1_group.DELETE(":placeId/:jobId/", v1.disconnect(bg_ctx))
			api_v1_group.POST(":placeId/:jobId/instance", v1.set_instance)
			api_v1_group.GET(":placeId/:jobId/instance", v1.get_instance)
		}
	}

	println("[V1] Started on :" + port)
	return gin.Run(":" + port)
}
