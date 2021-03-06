package initDB

import (
	"fmt"
	"ginFramework/conf"
	"strings"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
)

var DB *sqlx.DB

func InitDB() {
	//构建连接："用户名:密码@tcp(IP:端口)/数据库?charset=utf8"
	path := strings.Join([]string{conf.Cfg.Mysql.UserName, ":", conf.Cfg.Mysql.Password, "@tcp(", conf.Cfg.Mysql.Ip, ":", conf.Cfg.Mysql.Port, ")/", conf.Cfg.Mysql.DbName, "?charset=utf8&parseTime=true"}, "")
	//打开数据库,前者是驱动名，所以要导入： _ "github.com/go-sql-driver/mysql"
	DB, _ = sqlx.Open("mysql", path)
	//设置数据库最大连接数
	DB.SetConnMaxLifetime(100)
	//设置上数据库最大闲置连接数
	DB.SetMaxIdleConns(10)
	//验证连接
	if err := DB.Ping(); err != nil {
		fmt.Println("open database fail")
		return
	}
}
