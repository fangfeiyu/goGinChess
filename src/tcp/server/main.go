package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var addr = flag.String("addr", "localhost:8080", "http service address")

var upgrader = websocket.Upgrader{
	// 解决跨域问题
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
} // use default options

type linkReturn struct {
	LinkNum int
	Type    string
}

var memeberList map[string]*websocket.Conn

func ws(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	} else {
		memeberList[c.RemoteAddr().String()] = c
		lreturn := linkReturn{
			LinkNum: len(memeberList),
			Type:    "handReturn",
		}
		linkReturnJson, _ := json.Marshal(lreturn)
		fmt.Printf("%s", linkReturnJson)
		for _, e := range memeberList {
			e.WriteMessage(websocket.TextMessage, linkReturnJson)
		}
		fmt.Println("当前链接人数", len(memeberList))
	}
	defer c.Close()
	for {
		mt, message, err := c.ReadMessage()
		data := make(map[string]string)
		log.Printf("%d", mt)
		if err != nil {
			log.Println("read:", err)
			break
		}
		log.Printf("recv: %s", message)
		aerr := json.Unmarshal([]byte(message), &data)
		if aerr != nil {
			log.Println("read:", aerr)
			break
		}
		for i, e := range memeberList {
			data["from"] = "user" + i
			newStr, err := json.Marshal(data)
			if err != nil {
				log.Println("write:", err)
				break
			}
			e.WriteMessage(websocket.TextMessage, newStr)
		}

	}
}

func main() {
	memeberList = make(map[string]*websocket.Conn)
	flag.Parse()
	log.SetFlags(0)
	http.HandleFunc("/ws", ws)
	fmt.Println(*addr)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
