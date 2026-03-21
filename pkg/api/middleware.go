package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/unixtensor/monolith/pkg/game"
)

func VerifyToken(token *string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		token_key := ctx.GetHeader("x-api-key")
		if token_key != *token {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		ctx.Next()
	}
}

func VerifyGameConnected() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if !game.Connected() {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "No game linked"})
			return
		}
		ctx.Next()
	}
}
