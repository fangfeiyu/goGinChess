package main

import (
	"fmt"
	"ginFramework/conf"
	"ginFramework/initDB"
	"ginFramework/redis"
	"ginFramework/routers"

	"github.com/gin-gonic/gin"
)

func main() {
	conf.InitConf() // 初始化配置项
	fmt.Println(conf.Cfg.Redis.Addr)
	gin.SetMode(gin.DebugMode) // 设置gin系统运行环境

	initDB.InitDB() // 初始化数据库

	redis.RedisSet("test", "测试")

	data := redis.RedisGet("test")

	fmt.Println(data)

	routers.InitRouters() // 初始化路由
}
