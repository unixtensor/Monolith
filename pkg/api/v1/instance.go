package v1

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	game "github.com/unixtensor/monolith/pkg/games"
)

func Upload(ctx *gin.Context) {
	place_id := ctx.Param("placeId")
	job_id := ctx.Param("jobId")

	game, connected := game.GetGame(place_id, job_id)
	if !connected {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "game " + place_id + "/" + job_id + " does not exist."})
		return
	}

	if ctx.GetHeader("Content-Encoding") == "gzip" {
		gzip_data, err := io.ReadAll(ctx.Request.Body)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read gzip body."})
			return
		}
		game.Instance.NewCompressed(gzip_data)
	} else {
		var i gin.H
		if err := ctx.ShouldBindJSON(&i); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
		game.Instance.New(i)
	}
	ctx.Status(http.StatusOK)
}

func Get(ctx *gin.Context) {
	place_id := ctx.Param("placeId")
	job_id := ctx.Param("jobId")

	game, game_ok := game.GetGame(place_id, job_id)
	if !game_ok {
		ctx.JSON(http.StatusBadGateway, gin.H{"error": ""})
		return
	}
	if game.Instance.Compressed {
		ctx.Header("Content-Encoding", "gzip")
		ctx.Data(http.StatusOK, "application/octet-stream", game.Instance.InnerGzip)
		return
	}
	ctx.JSON(http.StatusOK, &game.Instance.Inner)
}
