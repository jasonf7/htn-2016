package main

import (
	"log"
	"fmt"
	"net/http"
	"time"
	"gopkg.in/labstack/echo.v1"
	"database/sql"
	"github.com/lib/pq"
)

type API struct {}

type User struct {
	Name string
	Email string
	Photo string
	Id string
}

var db *sql.DB

// Bind attaches api routes
func (api *API) Bind(group *echo.Group) {
	var err error
	db, err = sql.Open("postgres", "user=root dbname=harambe sslmode=disable host=45.33.41.186 port=26257")
	if err != nil {
		log.Fatal(err)
	}
	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}

	group.Get("/v1/conf", api.ConfHandler)
	group.Post("/v1/auth", api.AuthHandler)
}

func (api *API) ConfHandler(c *echo.Context) error {
	app := c.Get("app").(*App)
	<-time.After(time.Millisecond * 500)
	c.JSON(200, app.Conf.Root)
	return nil
}

func (api *API) AuthHandler(c *echo.Context) error {
	fbResponse := new(User)
	dbQuery := new(User)

	if err := c.Bind(fbResponse); err != nil {
		return err
	}

	err := db.QueryRow("INSERT INTO users(Name, Email, Photo, Id) VALUES($1, $2, $3, $4) RETURNING Name, Email, Photo, Id", fbResponse.Name, fbResponse.Email, fbResponse.Photo, fbResponse.Id).Scan(&dbQuery.Name, &dbQuery.Email, &dbQuery.Photo, &dbQuery.Id)

	if err != nil {
		if pqErrCode := err.(*pq.Error).Code; pqErrCode != "23505" { // Swallow insert on duplicate PKey
			fmt.Print("Unexpected db err: " + pqErrCode)
		} else {
			return c.JSON(http.StatusOK, fbResponse)
		}
	}

	fmt.Printf("%+v\n", dbQuery)

	return c.JSON(http.StatusOK, dbQuery)
}
