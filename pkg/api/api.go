package api

import (
	"compress/gzip"
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/unixtensor/monolith/pkg/game"
)

type Config struct {
	Port      string
	Token     string
	Debugging bool
}

func connect(ctx *gin.Context) {
	if game.Connected() {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if err := ctx.ShouldBindJSON(&game.Game); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Success"})
}

func is_connected(ctx *gin.Context) {
	if !game.Connected() {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "No game linked"})
		return
	}
	ctx.Next()
}

func upload(ctx *gin.Context) {
	gz, err := gzip.NewReader(ctx.Request.Body)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to decompress"})
		return
	}
	defer gz.Close()

	bytes, err := io.ReadAll(gz)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read body"})
		return
	}
	if err := json.Unmarshal(bytes, &game.GameInstance); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"Success": true})
}

func get_instance(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, &game.GameInstance)
}

func v1(api_root *gin.Engine) {
	api_v1 := api_root.Group("/api/v1")
	api_v1.POST("/connect", connect)
	api_v1.GET("/connected", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, game.Connected())
	})
	connected_api := api_v1.Group("/connected")
	connected_api.Use(is_connected)
	connected_api.POST("/upload", upload)
	connected_api.GET("/instance", get_instance)
}

func Start(cfg *Config) {
	if !cfg.Debugging {
		gin.SetMode(gin.ReleaseMode)
	}

	api_root := gin.Default()
	v1(api_root)
	log.Fatal(api_root.Run(":" + cfg.Port))
}
