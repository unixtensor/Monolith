package api

import (
	"compress/gzip"
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Config struct {
	Port      string
	Secret    string
	Debugging bool
}

type ConnectedGame struct {
	CreatorId int    `json:"CreatorId"`
	Id        int    `json:"Id"`
	Name      string `json:"Name"`
}

func connect(ctx *gin.Context) {
	var game ConnectedGame

	if game.Id != 0 {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	if err := ctx.ShouldBindJSON(&game); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "success"})
}

func upload(ctx *gin.Context) {
	gz, err := gzip.NewReader(ctx.Request.Body)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to decompress"})
		return
	}
	defer gz.Close()

	bytes, err := io.ReadAll(gz)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to read body"})
		return
	}

	var payload map[string]any
	if err := json.Unmarshal(bytes, &payload); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON"})
		return
	}

	log.Println(payload)
	ctx.JSON(http.StatusOK, gin.H{"success": true})
}

func v1(api_root *gin.Engine) {
	api_v1 := api_root.Group("/api/v1")

	api_v1.POST("/connect", connect)
	api_v1.POST("/upload", upload)
}

func Start(cfg *Config) {
	if !cfg.Debugging {
		gin.SetMode(gin.ReleaseMode)
	}

	api_root := gin.Default()
	v1(api_root)
	log.Fatal(api_root.Run(":" + cfg.Port))
}
