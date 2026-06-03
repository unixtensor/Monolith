package api

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"
	v1 "github.com/unixtensor/monolith/pkg/api/v1"
	"github.com/unixtensor/monolith/pkg/datastore"
)

type Api struct {
	Port,
	Token string
	Debug bool
	DS    *datastore.Datastore
}

func (s *Api) gin() *gin.Engine {
	if !s.Debug {
		gin.SetMode(gin.ReleaseMode)
	}
	api_root := gin.Default()
	api_root.ForwardedByClientIP = true
	return api_root
}

func (s *Api) V1(bg_ctx context.Context) {
	api_v1 := v1.V1{
		Token: s.Token,
		DS:    s.DS,
	}
	if err := api_v1.V1(bg_ctx, s.Port, s.gin()); err != nil {
		log.Fatalf("%s", err.Error())
	}
}
