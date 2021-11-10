package login

import (
	"ginFramework/models"
	"net/http"
	"strconv"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func UserLogin(c *gin.Context) {
	userName := c.PostForm("user_name")
	//password := c.PostForm("password")
	mobile, _ := strconv.ParseInt(userName, 10, 64)
	text, _ := models.UserQuery(mobile)
	if len(text) != 0 {
		session := sessions.Default(c)
		session.Set("userName", text[0].True_name)
		session.Save()
		c.Redirect(http.StatusMovedPermanently, "/")
	} else {
		c.Redirect(http.StatusMovedPermanently, "/login?code=authFail")
	}
}
