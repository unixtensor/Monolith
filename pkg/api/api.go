package api

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	v1 "github.com/unixtensor/monolith/pkg/api/v1"
)

type Api struct {
	Port  string
	Token string
	Debug bool
	Redis *redis.Client
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
		Redis: s.Redis,
	}
	if err := api_v1.V1(bg_ctx, s.Port, s.gin()); err != nil {
		log.Fatalf("%s", err.Error())
	}
}
