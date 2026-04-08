package game

import (
	"github.com/gin-gonic/gin"
)

type gzip []byte

type Instance struct {
	InnerGzip gzip
	Inner     gin.H
}

func (i *Instance) New(inner gin.H) {
	i.InnerGzip = nil
	i.Inner = inner
}

func (i *Instance) NewCompressed(inner gzip) {
	i.Inner = nil
	i.InnerGzip = inner
}
