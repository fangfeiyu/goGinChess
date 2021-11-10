package talkingroom

import (
	"encoding/json"
	"strconv"

	"github.com/gorilla/websocket"
)

// 用户进入处理用户信息方法
func UserInfoInit(memeberName map[string]string, data map[string]string, memeberList map[string]*websocket.Conn) {
	data["type"] = "system"
	memListArray, _ := json.Marshal(memeberName)
	memListStr := string(memListArray)
	data["linkNum"] = strconv.Itoa(len(memeberList))
	data["userList"] = memListStr
	data["content"] = "欢迎用户“" + data["name"] + "”来到本聊天室"
	SendToAllUser(memeberList, data)
}

// 用户离开处理方法
func UserLeave(memeberList map[string]*websocket.Conn, memeberName map[string]string, AddrStr string) {
	data := make(map[string]string)
	data["type"] = "logout"
	data["name"] = memeberName[AddrStr]
	delete(memeberList, AddrStr)
	delete(memeberName, AddrStr)
	SendToAllUser(memeberList, data)
}
