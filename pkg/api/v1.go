package api

import (
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
	if err := ctx.ShouldBindJSON(&game.Current.Metadata); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Success"})
}

func upload(ctx *gin.Context) {
	if ctx.GetHeader("Content-Encoding") == "gzip" {
		gzip_data, err := io.ReadAll(ctx.Request.Body)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Failed to read gzip body"})
			return
		}
		game.Current.Instance.InnerGzip = gzip_data
		game.Current.Instance.Inner = nil
	} else {
		if err := ctx.ShouldBindJSON(&game.Current.Instance.Inner); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
		game.Current.Instance.InnerGzip = nil
	}
	ctx.JSON(http.StatusOK, gin.H{"Success": true})
}

func get_instance(ctx *gin.Context) {
	if game.Current.Instance.Compressed {
		ctx.Header("Content-Encoding", "gzip")
		ctx.Header("Content-Type", "application/json")
		ctx.Data(http.StatusOK, "application/octet-stream", game.Current.Instance.InnerGzip)
		return
	}
	ctx.JSON(http.StatusOK, &game.Current.Instance.Inner)
}

func connected(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, game.Connected())
}

func v1(api_root *gin.Engine, cfg *Config) {
	api_v1 := api_root.Group("/api/v1")
	api_v1.POST("/connect", VerifyToken(&cfg.Token), connect)
	api_v1.GET("/connected", connected)

	connected_api := api_v1.Group("/connected", VerifyToken(&cfg.Token), VerifyGameConnected())
	connected_api.POST("/upload", upload)
	connected_api.GET("/instance", get_instance)
}

func Start(cfg *Config) {
	if !cfg.Debugging {
		gin.SetMode(gin.ReleaseMode)
	}

	api_root := gin.Default()
	v1(api_root, cfg)
	log.Fatal(api_root.Run(":" + cfg.Port))
}
