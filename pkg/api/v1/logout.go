package v1

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (v1 *V1) logout(ctx *gin.Context) {
	_, err := ctx.Cookie("session_token")
	if err != nil {
		ctx.Status(http.StatusBadRequest)
		return
	}
	delete_cookie(ctx)
	ctx.Status(http.StatusOK)
}
