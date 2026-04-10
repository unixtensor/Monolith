package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	v1 "github.com/unixtensor/monolith/pkg/api/v1"
)

type Config struct {
	Port  string
	Token string
	Debug bool
}

func (c *Config) v1(api_root *gin.Engine) {
	api_v1 := api_root.Group("/api/v1")
	{
		api_v1.POST("/login", func(ctx *gin.Context) { v1.Login(ctx, c.Token) })
		{
			api_v1.Use(VerifyToken(c.Token))
			api_v1.GET("/", func(ctx *gin.Context) { ctx.Status(http.StatusOK) })
			api_v1.GET("/games-servers", v1.Servers)
			api_v1.GET(":placeId", v1.Connected)
			api_v1.POST(":placeId/:jobId", v1.Connect)
			api_v1.POST(":placeId/:jobId/disconnect", v1.Disconnect)
			api_v1.POST(":placeId/:jobId/instance", v1.UploadInstance)
			api_v1.GET(":placeId/:jobId/instance", v1.GetInstance)
		}
	}
}

func (c *Config) Start() {
	if !c.Debug {
		gin.SetMode(gin.ReleaseMode)
	}

	api_root := gin.Default()
	c.v1(api_root)
	api_root.Run(":" + c.Port)
}
