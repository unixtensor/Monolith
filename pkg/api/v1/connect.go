package v1

import (
	"net/http"

	"github.com/gin-gonic/gin"
	game "github.com/unixtensor/monolith/pkg/games"
)

func Connect(ctx *gin.Context) {
	place_id := ctx.Param("placeId")
	job_id := ctx.Param("jobId")

	var new_game game.Game
	if err := ctx.ShouldBindJSON(&new_game); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	new_game.Add(place_id, job_id)
	ctx.Status(http.StatusOK)
}

func Connected(ctx *gin.Context) {
	place_id := ctx.Param("placeId")

	_, connected := game.GetServers(place_id)
	ctx.JSON(http.StatusOK, connected)
}
