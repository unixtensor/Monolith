package v1

import (
	"net/http"

	"github.com/gin-gonic/gin"
	game "github.com/unixtensor/monolith/pkg/games"
)

func Disconnect(ctx *gin.Context) {
	place_id := ctx.Param("placeId")
	deleted := game.Disconnect(place_id)

	if !deleted {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "game " + place_id + " does not exist."})
		return
	}
	ctx.Status(http.StatusOK)
}
