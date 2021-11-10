package talkingroom

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

func SendToAllUser(mem map[string]*websocket.Conn, data map[string]string) {
	data["send"] = "true"
	for _, e := range mem {
		newStr, err := json.Marshal(data)
		if err != nil {
			log.Println("write:userLeave", data)
		}
		e.WriteMessage(websocket.TextMessage, newStr)
	}
}
