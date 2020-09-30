package main

import (
	"fmt"
	"log"
	"net/http"
)

func requestHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello world, Path = %s", r.URL.Path)
	// fmt.Fprintf(w, "Request = %s", r.Method)

	switch r.Method {
	case "GET":
		log.Println("server: Receive GET Request")
	case "POST":
		log.Println("server: Receive POST Request")
	}

	log.Printf("server: Receive request from %s", r.URL.Path)
}

func main() {
	var HOST string = "0.0.0.0"
	var PORT int = 1337

	log.Println("[Info] Server Started ...")
	log.Printf("[Info] Listening on Port %d\n", PORT)

	http.HandleFunc("/test", requestHandler)
	http.ListenAndServe(fmt.Sprintf("%s:%d", HOST, PORT), nil)

}
