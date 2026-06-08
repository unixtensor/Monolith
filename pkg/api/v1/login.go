package v1

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (v1 *V1) login(ctx *gin.Context) {
	var s string
	if err := json.NewDecoder(ctx.Request.Body).Decode(&s); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if s != v1.Token {
		ctx.Status(http.StatusUnauthorized)
		return
	}

	ctx.SetCookieData(&http.Cookie{
		Name:     "session_token",
		Value:    v1.Token,
		Path:     "/",
		MaxAge:   86400,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})
	ctx.Status(http.StatusOK)
}
