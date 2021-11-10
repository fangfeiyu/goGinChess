package main

import (
	"ginFramework/conf"
	"ginFramework/initDB"
	"ginFramework/routers"

	"github.com/gin-gonic/gin"
)

func main() {
	conf.InitConf()            // 初始化配置项
	gin.SetMode(gin.DebugMode) // 设置gin系统运行环境

	initDB.InitDB() // 初始化数据库

	return

	routers.InitRouters() // 初始化路由
}
