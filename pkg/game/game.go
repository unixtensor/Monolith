package game

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Game struct {
	Name      string `json:"Name"`
	JobId     string `json:"JobId"`
	CreatorId uint   `json:"CreatorId"`
	Instance  instance
}

func (g *Game) Connect(ctx *gin.Context) {
	if err := ctx.ShouldBindJSON(&g); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.Status(http.StatusOK)
}

func (g *Game) Connected(ctx *gin.Context) {
	gameid := ctx.Param("gameId")
	ctx.JSON(http.StatusOK, Connected(gameid))
}
