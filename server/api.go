package main

import (
	"log"
	"fmt"
	"net/http"
	"time"
	"gopkg.in/labstack/echo.v1"
	"database/sql"
	"github.com/lib/pq"
	"os"
	"os/exec"
	"io"
	"strconv"

	"golang.org/x/net/context"
  "golang.org/x/oauth2/google"
  storage "google.golang.org/api/storage/v1"
	speech "google.golang.org/api/speech/v1beta1"
	language "google.golang.org/api/language/v1beta1"
)

type API struct {}

type User struct {
	Name string
	Email string
	Photo string
	Id string
}

type Upload struct {
	Id int
	Longitude float32
	Latitude float32
	Mood_Polarity float32
	Mood_Intensity float32
	Description string
	Url string
	UserId int
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
	group.Post("/v1/upload", api.UploadHandler)
	group.Get("/v1/entries", api.EntriesHandler)
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

	fmt.Printf("%+v\n", fbResponse)

	err := db.QueryRow("INSERT INTO users(Name, Email, Photo, Id) VALUES($1, $2, $3, $4) RETURNING Name, Email, Photo, Id", fbResponse.Name, fbResponse.Email, fbResponse.Photo, fbResponse.Id).Scan(&dbQuery.Name, &dbQuery.Email, &dbQuery.Photo, &dbQuery.Id)

	if err != nil {
		if pqErrCode := err.(*pq.Error).Code; pqErrCode != "23505" { // Swallow insert on duplicate PKey
			fmt.Print("Unexpected db err: " + pqErrCode + "\n")
			fmt.Print(err.(*pq.Error).Message + "\n")
			fmt.Print(err.(*pq.Error).Detail + "\n")
			fmt.Print(err.(*pq.Error).Hint + "\n")
		} else {
			return c.JSON(http.StatusOK, fbResponse)
		}
	}

	fmt.Printf("%+v\n", dbQuery)

	return c.JSON(http.StatusOK, dbQuery)
}

func (api *API) UploadHandler(c *echo.Context) error {
	upload := new(Upload)
	fmt.Print("Start\n")

	if err := c.Bind(upload); err != nil {
		fmt.Print("uhoh1\n")
		return err
	}

	fmt.Print(upload.Url + "\n")
	tempFileName := strconv.Itoa(upload.UserId) + "-" + strconv.Itoa(int(time.Now().Unix()))
	tempFileMp4 := tempFileName + ".mp4"
	tempFileMp3 := tempFileName + ".mp3"
	tempFileFlac := tempFileName + ".flac"
	fmt.Print(tempFileName + "\n")

	// download from firebase storage
  out, err := os.Create(tempFileMp4)
  if err != nil  {
		fmt.Print("uhoh2\n")
    return err
  }
  defer out.Close()

  // Get the data
  resp, err := http.Get(upload.Url)
  if err != nil {
		fmt.Print("uhoh3\n")
    return err
  }
  defer resp.Body.Close()

  // Writer the body to file
  _, err = io.Copy(out, resp.Body)
  if err != nil  {
		fmt.Print("uhoh4\n")
    return err
  }

	// convert mp4 to mp3 to flac
	err = exec.Command("ffmpeg", "-i", tempFileMp4, tempFileMp3).Run()
  if err != nil {
		fmt.Print(err.Error() + "\n")
		fmt.Print("uhoh5\n")
    return err
  }

	err = exec.Command("ffmpeg", "-i", tempFileMp3, "-c:a" , "flac", "-ar", "16000", "-sample_fmt", "s16", "-ac", "1", tempFileFlac).Run()
  if err != nil {
		fmt.Print(err.Error() + "\n")
		fmt.Print("uhoh6\n")
    return err
  }

	// Authentication is provided by the gcloud tool when running locally, and
  // by the associated service account when running on Compute Engine.
  client, err := google.DefaultClient(context.Background(), storage.DevstorageFullControlScope)
  if err != nil {
		fmt.Print(err.Error() + "\n")
		fmt.Print("uhoh10\n")
    return err
  }
  storageService, err := storage.New(client)
  if err != nil {
		fmt.Print(err.Error() + "\n")
		fmt.Print("uhoh11\n")
    return err
  }

	object := &storage.Object{Name: tempFileFlac}
  audioFile, err := os.Open(tempFileFlac)
  if err != nil {
		fmt.Print(err.Error() + "\n")
		fmt.Print("uhoh7\n")
    return err
 	}

 	if res, err := storageService.Objects.Insert("vio-video", object).Media(audioFile).Do(); err == nil {
	 	fmt.Printf("Created object %v at location %v\n\n", res.Name, res.SelfLink)
	} else {
		fmt.Print(err.Error() + "\n")
		fmt.Print("uhoh8\n")
    return err
 	}

	// hit speech to text
	speechService, err := speech.New(client)
	speechRecAudio := &speech.RecognitionAudio{Uri: "gs://vio-video/" + tempFileFlac}
	speechRecConfig := &speech.RecognitionConfig{Encoding: "FLAC", SampleRate: 16000}
	speechRequest := &speech.SyncRecognizeRequest{Audio: speechRecAudio, Config: speechRecConfig}

	speechText := ""
	if res, err := speechService.Speech.Syncrecognize(speechRequest).Do(); err == nil {
	 	fmt.Printf("What is it? %s\n", res.Results[0].Alternatives[0].Transcript)
		speechText = res.Results[0].Alternatives[0].Transcript
	} else {
		fmt.Print(err.Error() + "\n")
		fmt.Print("uhoh12\n")
    return err
 	}

	// hit text to sentiment
	languageService, err := language.New(client)
	languageDocument := &language.Document{Type: "PLAIN_TEXT", Content: speechText}
	sentimentRequest := &language.AnalyzeSentimentRequest{Document: languageDocument}

	sentimentMagnitude := 0.0
	sentimentPolarity := 0.0
	if res, err := languageService.Documents.AnalyzeSentiment(sentimentRequest).Do(); err == nil {
	 	fmt.Printf("What is it2? %.2f %.2f\n", res.DocumentSentiment.Magnitude, res.DocumentSentiment.Polarity)
		sentimentMagnitude = res.DocumentSentiment.Magnitude
		sentimentPolarity = res.DocumentSentiment.Polarity
	} else {
		fmt.Print(err.Error() + "\n")
		fmt.Print("uhoh13\n")
    return err
 	}

	// insert into db
	err = db.QueryRow("INSERT INTO entries(Longitude, Latitude, Mood_Polarity, Mood_Intensity, Description, Url, UserId) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING Id", upload.Longitude, upload.Latitude, sentimentPolarity, sentimentMagnitude, upload.Description, upload.Url, upload.UserId).Scan(&upload.Id)

	if err != nil {
		if pqErrCode := err.(*pq.Error).Code; pqErrCode != "23505" { // Swallow insert on duplicate PKey
			fmt.Print("Unexpected db err: " + pqErrCode + "\n")
			fmt.Print(err.(*pq.Error).Message + "\n")
			fmt.Print(err.(*pq.Error).Detail + "\n")
			fmt.Print(err.(*pq.Error).Hint + "\n")
			return err
		}
	}

	return c.JSON(http.StatusOK, upload)
}

func (api *API) EntriesHandler(c *echo.Context) error {
	// var slice := make([]int, elems)

	rows, err := db.Query("SELECT * FROM entries")
	if err != nil {
		return err
	}
	defer rows.Close()

	var entries []Upload
	for rows.Next() {
		var entry Upload

		err := rows.Scan(&entry.Id, &entry.Latitude, &entry.Longitude, &entry.Mood_Polarity, &entry.Mood_Intensity, &entry.Description, &entry.Url, &entry.UserId)
		if err != nil {
			fmt.Print(err.Error() + "\n")
		}

		fmt.Print(strconv.Itoa(entry.Id) + "\n")

		entries = append(entries, entry)
	}

	return c.JSON(http.StatusOK, entries)
}
