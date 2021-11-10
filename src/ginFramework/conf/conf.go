package conf

import (
	"encoding/json"
	"fmt"
	"os"
)

type Config struct {
	Mysql DatabaseConfig `json:"mysql"`
}

type DatabaseConfig struct {
	UserName string `json:"userName"`
	Password string `json:"password"`
	Ip       string `json:"ip"`
	Port     string `json:"port"`
	DbName   string `json:"dbName"`
}

var Cfg *Config = nil

func InitConf() {
	file, _ := os.Open("./conf/app.json")
	decoder := json.NewDecoder(file)
	err := decoder.Decode(&Cfg)
	fmt.Println(Cfg)
	if err != nil {
	}
}
