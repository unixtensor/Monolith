package v1

import (
	"net/http"

	"github.com/gin-gonic/gin"
	game "github.com/unixtensor/monolith/pkg/games"
)

func Servers(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, game.Games)
}
