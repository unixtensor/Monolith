package game

import (
	"github.com/gin-gonic/gin"
)

type gzip []byte

type Instance struct {
	Compressed bool
	InnerGzip  gzip
	Inner      gin.H
}

func (i *Instance) New(inner gin.H) {
	i.Compressed = false
	i.InnerGzip = nil
	i.Inner = inner
}

func (i *Instance) NewCompressed(inner gzip) {
	i.Compressed = true
	i.InnerGzip = inner
	i.Inner = nil
}
