package gameFunc

import (
	"encoding/json"
	"fmt"
	"ginFramework/server/talkingroom"
	"log"
	"math/rand"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// 卡片结构体
type Card struct {
	FlowerColor int `json:"flower"`
	Num         int `json:"num"`
}

type gameStatusTemplate struct {
	memCardList map[string][]Card        // 用户手牌
	memStatus   map[string]*UserGameInfo // 用户是否活着状态位, 在比牌与弃牌时判断是否仅一人存活来判断游戏是否结束
	turnIndex   string                   // 到谁的出牌轮次
}

type gameRoomStatus struct {
	roomId         int
	roomStatus     int // 房间状态 0-未开始 1-开始游戏
	roomMemberList map[string]*websocket.Conn
	roomMenberName map[string]string
}

type gameReturnToUser struct {
	Type      string `json:"type"`
	UserCard  []Card `json:"userCard"`
	TurnIndex string `json:"turnIndex"`
}

type UserGameInfo struct {
	LiveStatus int
	NextTurn   string
}

var gameRoom map[string]*gameRoomStatus

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

const ALIVE = 1

const DEAD = 2

var gameStatusList map[string]*gameStatusTemplate // 游戏局列 map[房间ID]游戏内数据

var gameReturn gameReturnToUser

func GameWs(g *gin.Context) {
	gameStatusList = make(map[string]*gameStatusTemplate)
	gameRoom = make(map[string]*gameRoomStatus)
	c, err := upgrader.Upgrade(g.Writer, g.Request, nil)
	if err != nil {
		return
	}
	defer c.Close()
	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			// room_id := addrToRoomId[c.RemoteAddr().String()]
			// talkingroom.UserLeave(roomList[room_id].memberList, roomList[room_id].memeberName, c.RemoteAddr().String())
			// 解散房间处理
			break
		}
		gameData := make(map[string]string)
		error := json.Unmarshal([]byte(message), &gameData)
		if error != nil {
			log.Println("read:", error)
			break
		}

		roomId := gameData["roomId"]

		switch gameData["type"] {
		case "joinGame":
			// 加入房间, 判断房间信息是否存在, 如果不存在则创建房间信息, 并推送房间内所有用户有用户进入房间;
			if _, ok := gameRoom[roomId]; !ok {
				gameRoom[roomId] = &gameRoomStatus{
					roomStatus:     0, // 房间状态 0-未开始 1-开始游戏
					roomMemberList: make(map[string]*websocket.Conn),
					roomMenberName: make(map[string]string),
				}
			}

			gameRoom[roomId].roomMemberList[c.RemoteAddr().String()] = c
			gameRoom[roomId].roomMenberName[c.RemoteAddr().String()] = gameData["name"]
			sendData := make(map[string]string)
			sendData["type"] = "system"
			sendData["content"] = "用户" + gameData["name"] + "进入房间"
			sendGameInfoToRoomUser(gameRoom[roomId].roomMemberList, sendData)
		case "startGame":
			// 开始游戏 修改房间状态，初始化游戏对局状态与牌库，判断人数是否满三人，如果没有满三人加入机器人、并给用户发牌
			if _, ok := gameRoom[roomId]; ok && gameRoom[roomId].roomStatus == 0 {
				gameRoom[roomId].roomStatus = 1
			} else {
				sendData := make(map[string]string)
				sendData["type"] = "error"
				sendData["content"] = "房间状态错误, 或者房间不存在"
				newStr, _ := json.Marshal(sendData)
				c.WriteMessage(websocket.TextMessage, newStr)
				break
			}

			memList := []string{}
			for i := range gameRoom[roomId].roomMemberList {
				memList = append(memList, i)
			}
			if len(memList) == 1 {
				memList = append(memList, "robot-a")
				memList = append(memList, "robot-b")
			} else if len(memList) == 2 {
				memList = append(memList, "robot-a")
			}
			gameStatusList[roomId] = &gameStatusTemplate{
				memCardList: make(map[string][]Card),          // 用户手牌
				memStatus:   make(map[string]*UserGameInfo),   // 用户是否活着状态位, 在比牌与弃牌时判断是否仅一人存活来判断游戏是否结束
				turnIndex:   memList[rand.Intn(len(memList))], // 到谁的出牌轮次
			}

			// 初始化牌库，并从牌库里抽取牌分发给游戏内用户，并设置alive
			cardLib := cardLib()
			for index, v := range memList {
				var nextMem string
				if index < len(memList)-1 {
					nextMem = memList[index+1]
				} else {
					nextMem = memList[0]
				}

				gameStatusList[roomId].memStatus[v] = &UserGameInfo{
					LiveStatus: ALIVE,
					NextTurn:   nextMem,
				} // 初始化用户都是或者
				for i := 1; i <= 3; i++ {
					var newCard Card
					cardLib, newCard = getCard(cardLib)
					gameStatusList[roomId].memCardList[v] = append(gameStatusList[roomId].memCardList[v], newCard)
				}

				if _, ok := gameRoom[roomId].roomMemberList[v]; ok {
					conn := gameRoom[roomId].roomMemberList[v]
					gameReturn.Type = "gameInit"
					gameReturn.UserCard = gameStatusList[roomId].memCardList[v]
					gameReturn.TurnIndex = gameStatusList[roomId].turnIndex
					newStr, _ := json.Marshal(gameReturn)

					conn.WriteMessage(websocket.TextMessage, newStr)
				}
			}

		case "pass":
			data := make(map[string]string)
			index := gameStatusList[roomId].turnIndex
			data["operate"] = index + "过牌"
			var nextMenStr string
			for {
				nextMenStr = gameStatusList[roomId].memStatus[index].NextTurn
				if gameStatusList[roomId].memStatus[nextMenStr].LiveStatus == ALIVE {
					gameStatusList[roomId].turnIndex = nextMenStr
					break
				} else {
					index = nextMenStr
				}
			}
			data["type"] = "gameTurnChange"
			data["turnIndex"] = nextMenStr
			for v := range gameStatusList[roomId].memStatus {
				if _, ok := gameRoom[roomId].roomMemberList[v]; ok {
					conn := gameRoom[roomId].roomMemberList[v]
					newStr, _ := json.Marshal(data)
					conn.WriteMessage(websocket.TextMessage, newStr)
				}
			}
		case "discard":
			data := make(map[string]string)
			data["type"] = "system"
			discardType := gameData["user"]
			if discardType == "robot" {
				index := gameStatusList[roomId].turnIndex
				gameStatusList[roomId].memStatus[index].LiveStatus = DEAD
				data["content"] = "用户" + index + "弃牌"
				for v := range gameStatusList[roomId].memStatus {
					if _, ok := gameRoom[roomId].roomMemberList[v]; ok {
						conn := gameRoom[roomId].roomMemberList[v]
						newStr, _ := json.Marshal(data)
						conn.WriteMessage(websocket.TextMessage, newStr)
					}
				}
			} else if discardType == "user" {
				gameStatusList[roomId].memStatus[c.RemoteAddr().String()].LiveStatus = DEAD
				data["content"] = "用户" + gameRoom[roomId].roomMenberName[c.RemoteAddr().String()] + "弃牌"
				for v := range gameStatusList[roomId].memStatus {
					if _, ok := gameRoom[roomId].roomMemberList[v]; ok {
						conn := gameRoom[roomId].roomMemberList[v]
						newStr, _ := json.Marshal(data)
						conn.WriteMessage(websocket.TextMessage, newStr)
					}
				}
			}

			// 判断是否胜利

		case "gameEnd":
			_, ok := gameRoom[roomId]
			if ok && gameRoom[roomId].roomStatus == 1 {
				gameRoom[roomId].roomStatus = 0
			}
			fmt.Println(gameRoom)
		case "user":
			// 用户房间频道说话推送所有人
			gameData["from"] = gameRoom[roomId].roomMenberName[c.RemoteAddr().String()]
			talkingroom.SendToAllUser(gameRoom[roomId].roomMemberList, gameData)
		}
	}
}

func sendGameInfoToRoomUser(mem map[string]*websocket.Conn, data map[string]string) {
	data["send"] = "true"
	for _, e := range mem {
		newStr, err := json.Marshal(data)
		if err != nil {
			log.Println("write:userLeave", data)
		}
		e.WriteMessage(websocket.TextMessage, newStr)
	}
}

// 发牌逻辑，每次发牌从随机花色中挑选剩余卡牌发放，并删除卡牌
func getCard(cardLib map[int][]int) (map[int][]int, Card) {
	flowerColor := rand.Intn(3) + 1
	index := rand.Intn(len(cardLib[flowerColor]))
	num := cardLib[flowerColor][index]
	newCard := Card{FlowerColor: flowerColor, Num: num}
	cardLib[newCard.FlowerColor] = append(cardLib[newCard.FlowerColor][:index], cardLib[newCard.FlowerColor][index+1:]...)

	return cardLib, newCard
}

func cardLib() map[int][]int {
	// 花色 1 - 红桃 2- 黑桃 3 - 草花 4 - 方块
	var cardLib map[int][]int
	cardLib = make(map[int][]int)
	var card []int
	for i := 1; i <= 4; i++ {
		card = []int{}
		for n := 1; n <= 13; n++ {
			card = append(card, n)
		}
		cardLib[i] = card
	}

	return cardLib
}
