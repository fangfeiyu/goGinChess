package models

import (
	"ginFramework/initDB"
)

type User struct {
	U_id          int64  `db:"u_id"`
	User_name     string `db:"user_name"`
	True_name     string `db:"true_name"`
	Mobile        int64  `db:"mobile"`
	Password_hash string `db:"password_hash"`
}

//查询操作
func UserQuery(mobile int64) ([]User, error) {
	var User []User
	err := initDB.DB.Select(&User, "select u_id,user_name,mobile,password_hash, true_name from xlhb_user where mobile=?", mobile)
	if err != nil {
		return nil, err
	}

	return User, nil
}
