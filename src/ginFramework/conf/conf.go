package conf

import (
	"encoding/json"
	"os"
)

type Config struct {
	Mysql DatabaseConfig `json:"mysql"`
	Redis RedisConfig    `json:"redis"`
}

type DatabaseConfig struct {
	UserName string `json:"userName"`
	Password string `json:"password"`
	Ip       string `json:"ip"`
	Port     string `json:"port"`
	DbName   string `json:"dbName"`
}

type RedisConfig struct {
	Addr     string `json"addr"`
	Password string `json"password"`
	Port     string `json"port"`
}

var Cfg *Config = nil

func InitConf() {
	file, _ := os.Open("./conf/app.json")
	decoder := json.NewDecoder(file)
	err := decoder.Decode(&Cfg)
	if err != nil {
	}
}
