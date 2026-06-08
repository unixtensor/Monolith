package v1

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func delete_cookie(ctx *gin.Context) {
	ctx.SetCookieData(&http.Cookie{
		Name:     "session_token",
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})
}

func (v1 *V1) verify_cookie(ctx *gin.Context, token string) bool {
	token_cookie, _ := ctx.Cookie("session_token")
	match := token_cookie == token
	if !match {
		delete_cookie(ctx)
	}
	return match
}

func (v1 *V1) verify_token() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		if v1.verify_cookie(ctx, v1.Token) {
			ctx.Next()
			return
		}
		token_key := ctx.GetHeader("X-API-Key")
		if token_key != v1.Token {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		ctx.Next()
	}
}
