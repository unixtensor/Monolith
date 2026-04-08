package v1

import (
	"net/http"

	"github.com/gin-gonic/gin"
	game "github.com/unixtensor/monolith/pkg/games"
)

func Servers(ctx *gin.Context) {
	keys := make([]string, 0, len(game.Games))
	for key := range game.Games {
		keys = append(keys, key)
	}
	ctx.JSON(http.StatusOK, keys)
}
