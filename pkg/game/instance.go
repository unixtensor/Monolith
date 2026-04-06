package game

import (
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

type gzip []byte

type instance struct {
	Compressed bool
	InnerGzip  gzip
	Inner      gin.H
}

func (i *instance) Upload(ctx *gin.Context) {
	if ctx.GetHeader("Content-Encoding") == "gzip" {
		gzip_data, err := io.ReadAll(ctx.Request.Body)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Failed to read gzip body"})
			return
		}
		i.InnerGzip = gzip_data
		i.Inner = nil
	} else {
		if err := ctx.ShouldBindJSON(&i.Inner); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
		i.InnerGzip = nil
	}
	ctx.Status(http.StatusOK)
}

func (i *instance) Get(ctx *gin.Context) {
	if i.Compressed {
		ctx.Header("Content-Encoding", "gzip")
		ctx.Header("Content-Type", "application/json")
		ctx.Data(http.StatusOK, "application/octet-stream", i.InnerGzip)
		return
	}
	ctx.JSON(http.StatusOK, i.Inner)
}
