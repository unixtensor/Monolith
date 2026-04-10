package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func VerifyCookie(ctx *gin.Context, token string) bool {
	token_cookie, _ := ctx.Cookie("session_token")
	match := token_cookie == token
	if !match {
		//delete
		ctx.SetCookieData(&http.Cookie{
			Name:     "session_token",
			Value:    "",
			MaxAge:   -1,
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteStrictMode,
		})
	}
	return match
}

func VerifyToken(token string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if VerifyCookie(ctx, token) {
			ctx.Next()
			return
		}
		token_key := ctx.GetHeader("X-API-Key")
		if token_key != token {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		ctx.Next()
	}
}
