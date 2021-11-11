package redis

import (
	"fmt"
	"ginFramework/conf"
	"time"

	redigo "github.com/redigo/redis"
)

func PoolInitRedis() *redigo.Pool {
	return &redigo.Pool{
		MaxIdle:     2, //空闲数
		IdleTimeout: 240 * time.Second,
		MaxActive:   3, //最大数
		Dial: func() (redigo.Conn, error) {
			c, err := redigo.Dial("tcp", conf.Cfg.Redis.Addr+":"+conf.Cfg.Redis.Port)
			if err != nil {
				return nil, err
			}
			if conf.Cfg.Redis.Password != "" {
				if _, err := c.Do("AUTH", conf.Cfg.Redis.Password); err != nil {
					c.Close()
					return nil, err
				}
			}
			return c, err
		},
		TestOnBorrow: func(c redigo.Conn, t time.Time) error {
			_, err := c.Do("PING")
			return err
		},
	}
}

func RedisSet(key string, value string) {
	pool := PoolInitRedis()
	_, err := pool.Get().Do("SET", key, value)
	if err != nil {
		fmt.Println(err)
	}
}

func RedisGet(key string) string {
	pool := PoolInitRedis()
	v, _ := redigo.String(pool.Get().Do("GET", key))
	return v
}
