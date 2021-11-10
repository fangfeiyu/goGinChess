package routers

import (
	"encoding/json"
	"ginFramework/server/gameFunc"
	"ginFramework/server/login"
	"ginFramework/server/talkingroom"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type roomMemberList struct {
	memberList  map[string]*websocket.Conn
	memeberName map[string]string
}

var roomList map[string]roomMemberList // 聊天室列表 包含用户列表与用户名称列表

var addrToRoomId map[string]string

func ws(g *gin.Context) {
	c, err := upgrader.Upgrade(g.Writer, g.Request, nil)
	if err != nil {
		return
	}
	defer c.Close()
	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			room_id := addrToRoomId[c.RemoteAddr().String()]
			talkingroom.UserLeave(roomList[room_id].memberList, roomList[room_id].memeberName, c.RemoteAddr().String())
			break
		}
		data := make(map[string]string)
		error := json.Unmarshal([]byte(message), &data)
		if error != nil {
			log.Println("read:", error)
			break
		}
		switch data["type"] {
		case "login":
			room_id := data["room_id"]
			addrToRoomId[c.RemoteAddr().String()] = room_id
			if _, ok := roomList[room_id]; !ok {
				roomList[room_id] = roomMemberList{
					memberList:  make(map[string]*websocket.Conn),
					memeberName: make(map[string]string),
				}
			}
			roomList[room_id].memberList[c.RemoteAddr().String()] = c
			roomList[room_id].memeberName[c.RemoteAddr().String()] = data["name"]
			talkingroom.UserInfoInit(roomList[room_id].memeberName, data, roomList[room_id].memberList)
		case "user":
			room_id := addrToRoomId[c.RemoteAddr().String()]
			data["from"] = roomList[room_id].memeberName[c.RemoteAddr().String()]
			talkingroom.SendToAllUser(roomList[room_id].memberList, data)
		case "checkout_room":
			room_id := data["room_id"]
			old_room_id := addrToRoomId[c.RemoteAddr().String()]
			addrToRoomId[c.RemoteAddr().String()] = room_id
			if _, ok := roomList[room_id]; !ok {
				roomList[room_id] = roomMemberList{
					memberList:  make(map[string]*websocket.Conn),
					memeberName: make(map[string]string),
				}
			}
			roomList[room_id].memberList[c.RemoteAddr().String()] = roomList[old_room_id].memberList[c.RemoteAddr().String()]
			roomList[room_id].memeberName[c.RemoteAddr().String()] = roomList[old_room_id].memeberName[c.RemoteAddr().String()]
			data["name"] = roomList[old_room_id].memeberName[c.RemoteAddr().String()]
			delete(roomList[old_room_id].memberList, c.RemoteAddr().String())
			delete(roomList[old_room_id].memeberName, c.RemoteAddr().String())
			talkingroom.UserInfoInit(roomList[room_id].memeberName, data, roomList[room_id].memberList)
		}
	}
}

func InitRouters() {
	roomList = make(map[string]roomMemberList)
	addrToRoomId = make(map[string]string)
	r := gin.New()
	r.LoadHTMLGlob("./view/*")
	r.StaticFS("/public", http.Dir("./public"))
	store := cookie.NewStore([]byte("secret"))
	r.Use(sessions.Sessions("mysession", store))

	r.GET("/login", func(c *gin.Context) {
		code := c.Query("code")

		c.HTML(http.StatusOK, "login.html", gin.H{
			"code": code,
		})
	})

	r.POST("/login/auth", login.UserLogin)

	r.GET("/logout", UserLogout)

	auth := r.Group("/", LoginAuth())
	auth.GET("/", func(c *gin.Context) {
		sessions := sessions.Default(c)
		userName := sessions.Get("userName")
		c.HTML(http.StatusOK, "index.html", gin.H{
			"userName": userName,
		})
	})

	r.GET("/ws", ws)

	r.GET("/gameWs", gameFunc.GameWs)

	r.Run(":8000")
}

func LoginAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		sessions := sessions.Default(c)
		userName := sessions.Get("userName")
		if userName == nil {
			c.Redirect(http.StatusMovedPermanently, "/login")
			c.Abort()
		} else {
			c.Next()
		}
	}
}

func UserLogout(c *gin.Context) {
	session := sessions.Default(c)
	session.Delete("userName")
	session.Save()
	c.Redirect(http.StatusMovedPermanently, "/login?code=已登出，请重新登录")
	c.Abort()
}
