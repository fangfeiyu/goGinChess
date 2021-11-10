package models

import (
	"database/sql"
	"ginFramework/initDB"
	"strconv"
	"time"
)

type ResolutionConfig struct {
	Id            int64         `db:"id"`
	Resolution_id int64         `db:"resolution_id"`
	Type          int64         `db:"type"`
	Created       time.Time     `db:"created"`
	Updated       time.Time     `db:"updated"`
	Robot_id      sql.NullInt64 `db:"robot_id"`
}

//查询操作
func Query() string {
	var ResolutionConfig []ResolutionConfig
	err := initDB.DB.Select(&ResolutionConfig, "select * from xlhb_resolution_config where id=?", 3)
	if err != nil {
		return "error"
	}

	return "select succ:" + strconv.FormatInt(ResolutionConfig[0].Resolution_id, 10)
	// DB.QueryRow("select * from user where id=1").Scan(user.age, user.id, user.name, user.phone, user.sex)

	// stmt, e := DB.Prepare("select * from user where id=?")
	// query, e := stmt.Query(1)
	// query.Scan()
}
