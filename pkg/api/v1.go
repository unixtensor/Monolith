package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/unixtensor/monolith/pkg/game"
)

type Config struct {
	Port  string
	Token string
	Debug bool
}

func ping(ctx *gin.Context) {
	ctx.Status(http.StatusOK)
}

func connected(ctx *gin.Context) {
	game_id := ctx.Param("gameId")
	ctx.JSON(http.StatusOK, game.Connected(game_id))
}

func connect(ctx *gin.Context) {
	game_id := ctx.Param("gameId")
	game.Connect(game_id)
}

func (c *Config) v1(api_root *gin.Engine) {
	api_v1 := api_root.Group("/api/v1")
	{
		api_v1.GET("/", ping)
		api_v1.Use(VerifyToken(&c.Token))
		api_v1.GET("/servers")
		api_v1.GET(":gameId/", connected)
		api_v1.POST(":gameId/:jobId/", connect)
		api_v1.POST(":gameId/:jobId/disconnect", disconnect)
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
